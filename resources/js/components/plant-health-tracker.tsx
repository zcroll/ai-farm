import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Activity,
  Target,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

interface HealthScan {
  id: number;
  date: string;
  predicted_disease: string;
  confidence: number;
  plant_type: string;
  is_healthy: boolean;
}

interface PlantHealthTrackerProps {
  recentScans: HealthScan[];
  plantTypes: string[];
}

const PlantHealthTracker: React.FC<PlantHealthTrackerProps> = ({ recentScans = [], plantTypes = [] }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'season'>('week');

  // Calculate health metrics
  const healthMetrics = useMemo(() => {
    const total = recentScans.length;
    const healthy = recentScans.filter(scan => scan.is_healthy).length;
    const diseased = total - healthy;
    const healthRate = total > 0 ? (healthy / total) * 100 : 0;
    
    // Get trend data for the chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const trendData = last7Days.map(date => {
      const dayScans = recentScans.filter(scan => scan.date.startsWith(date));
      const dayHealthy = dayScans.filter(scan => scan.is_healthy).length;
      const dayTotal = dayScans.length;
      const healthPercentage = dayTotal > 0 ? (dayHealthy / dayTotal) * 100 : null;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        health: healthPercentage,
        scans: dayTotal
      };
    });

    // Plant type distribution
    const plantTypeDistribution = plantTypes.map(type => {
      const typeScans = recentScans.filter(scan => scan.plant_type === type);
      const typeHealthy = typeScans.filter(scan => scan.is_healthy).length;
      return {
        name: type,
        total: typeScans.length,
        healthy: typeHealthy,
        healthRate: typeScans.length > 0 ? (typeHealthy / typeScans.length) * 100 : 0
      };
    }).filter(item => item.total > 0);

    // Recent trend calculation
    const recentTrend = (() => {
      if (trendData.length < 2) return 'stable';
      const recent = trendData.slice(-3).filter(d => d.health !== null);
      if (recent.length < 2) return 'stable';
      
      const firstHealth = recent[0].health!;
      const lastHealth = recent[recent.length - 1].health!;
      const diff = lastHealth - firstHealth;
      
      if (diff > 10) return 'improving';
      if (diff < -10) return 'declining';
      return 'stable';
    })();

    return {
      total,
      healthy,
      diseased,
      healthRate,
      trendData: trendData.filter(d => d.health !== null),
      plantTypeDistribution,
      recentTrend
    };
  }, [recentScans, plantTypes]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getTrendMessage = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Plant health is improving!';
      case 'declining': return 'Plant health needs attention';
      default: return 'Plant health is stable';
    }
  };

  const getHealthGrade = (rate: number) => {
    if (rate >= 90) return { grade: 'A+', color: 'text-green-500', bg: 'bg-green-900' };
    if (rate >= 80) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-900' };
    if (rate >= 70) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-900' };
    if (rate >= 60) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const healthGrade = getHealthGrade(healthMetrics.healthRate);

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (recentScans.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center">
          <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Start Tracking Plant Health</h3>
          <p className="text-gray-400 mb-6">
            Scan some plants to see your health trends and insights here
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            <Leaf className="h-4 w-4 mr-2" />
            Scan Your First Plant
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Health Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-green-500" />
            Plant Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${healthGrade.bg} flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${healthGrade.color}`}>
                  {healthGrade.grade}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {healthMetrics.healthRate.toFixed(1)}%
                </h3>
                <p className="text-gray-400">Overall Health Score</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(healthMetrics.recentTrend)}
                <span className={`font-medium ${getTrendColor(healthMetrics.recentTrend)}`}>
                  {getTrendMessage(healthMetrics.recentTrend)}
                </span>
              </div>
              <p className="text-sm text-gray-400">Based on {healthMetrics.total} recent scans</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{healthMetrics.healthy}</div>
              <div className="text-sm text-gray-400">Healthy Plants</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{healthMetrics.diseased}</div>
              <div className="text-sm text-gray-400">Need Care</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{healthMetrics.total}</div>
              <div className="text-sm text-gray-400">Total Scans</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Trend Chart */}
      {healthMetrics.trendData.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              7-Day Health Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthMetrics.trendData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    domain={[0, 100]}
                    label={{ value: 'Health %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151', 
                      color: 'white',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value?.toFixed(1)}%`,
                      'Health Rate'
                    ]}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plant Type Performance */}
      {healthMetrics.plantTypeDistribution.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Leaf className="h-5 w-5 text-green-500" />
              Plant Type Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthMetrics.plantTypeDistribution.map((plant, index) => (
                <motion.div
                  key={plant.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <h4 className="font-medium text-white">{plant.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {plant.total} scans
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {plant.healthRate.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">healthy</div>
                    </div>
                  </div>
                  <Progress 
                    value={plant.healthRate} 
                    className="h-2" 
                    style={{
                      backgroundColor: '#374151'
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{plant.healthy} healthy</span>
                    <span>{plant.total - plant.healthy} need care</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Badges */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {healthMetrics.total >= 10 && (
              <div className="text-center p-3 bg-black/20 rounded-lg">
                <Target className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Explorer</div>
                <div className="text-xs text-purple-200">10+ scans completed</div>
              </div>
            )}
            {healthMetrics.healthRate >= 80 && (
              <div className="text-center p-3 bg-black/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Green Thumb</div>
                <div className="text-xs text-purple-200">80%+ health rate</div>
              </div>
            )}
            {healthMetrics.recentTrend === 'improving' && (
              <div className="text-center p-3 bg-black/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Improving</div>
                <div className="text-xs text-purple-200">Health trending up</div>
              </div>
            )}
            {healthMetrics.plantTypeDistribution.length >= 3 && (
              <div className="text-center p-3 bg-black/20 rounded-lg">
                <Leaf className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Diverse Farmer</div>
                <div className="text-xs text-purple-200">3+ plant types</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlantHealthTracker;