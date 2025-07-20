import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';

interface Disease {
  id: number;
  name: string;
  description: string;
  treatment_suggestions: string;
  source_url: string | null;
}

interface Scan {
  id: number;
  image_path: string;
  predicted_disease: string;
  confidence: number;
  created_at: string;
}

interface AnimatedResultCardProps {
  scan: Scan;
  disease: Disease;
  onSaveResult?: () => void;
  onNewScan?: () => void;
}

const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);

export const AnimatedResultCard: React.FC<AnimatedResultCardProps> = ({
  scan,
  disease,
  onSaveResult,
  onNewScan,
}) => {
  const isHealthy = disease.name.toLowerCase().includes('healthy');
  const confidencePercent = Math.round(scan.confidence * 100);
  
  // Format the disease name for display (remove underscores)
  const formattedDiseaseName = disease.name.replace(/_/g, ' ');
  
  // Debug treatment suggestions
  useEffect(() => {
    console.log("Disease data:", disease);
    console.log("Treatment suggestions:", disease.treatment_suggestions);
  }, [disease]);
  
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full overflow-hidden ${isHealthy ? 'border-green-500' : 'border-amber-500'} border-2 bg-black text-white`}
    >
      <CardHeader className={`${isHealthy ? 'bg-black border-b border-green-500/30' : 'bg-black border-b border-amber-500/30'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          {isHealthy ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
          <CardTitle className="text-xl text-white">
            {isHealthy ? 'Healthy Plant Detected!' : 'Disease Detected'}
          </CardTitle>
        </motion.div>
        <CardDescription className="text-gray-400">
          Scan completed on {new Date(scan.created_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
      
      <MotionCardContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="p-6 grid gap-6 bg-black"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <img 
              src={`/storage/${scan.image_path}`} 
              alt="Plant scan" 
              className="w-full h-64 object-cover rounded-lg shadow-md" 
            />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1 text-white">Diagnosis</h3>
              <Badge variant={isHealthy ? "success" : "destructive"} className="text-sm py-1">
                {formattedDiseaseName}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-white">Confidence</span>
                <span className="text-sm font-medium text-white">{confidencePercent}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Progress value={confidencePercent} className="h-2" />
              </motion.div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-1 text-white">Description</h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-sm text-gray-300"
              >
                {disease.description}
              </motion.p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-white">Treatment Suggestions</h3>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            {disease.treatment_suggestions ? (
              <p className="text-sm text-gray-300">{disease.treatment_suggestions}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No treatment suggestions available for this condition.</p>
            )}
          </div>
        </motion.div>
      </MotionCardContent>
      
      <CardFooter className="flex justify-between p-6 bg-black border-t border-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button 
            variant="outline"
            onClick={onNewScan}
            className="flex items-center gap-2 bg-gray-900 text-white border-gray-700 hover:bg-gray-800"
          >
            <Leaf className="h-4 w-4" />
            New Scan
          </Button>
        </motion.div>
        
        {disease.source_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button 
              variant="default"
              onClick={() => window.open(disease.source_url!, '_blank')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
        {disease.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button 
              variant="default"
              onClick={() => window.location.href = `/diseases/${disease.id}`}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </MotionCard>
  );
};

export default AnimatedResultCard; 