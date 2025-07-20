import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Plus, 
  Search, 
  TrendingUp, 
  ArrowLeft,
  Users,
  BookOpen,
  Leaf,
  Pin,
  Star,
  Clock,
  Filter
} from 'lucide-react';

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    views: number;
    likes: number;
    is_featured: boolean;
    is_pinned: boolean;
    published_at: string;
    user: {
        id: number;
        name: string;
    };
    comments: Array<{
        id: number;
    }>;
}

interface Props {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: string[];
    featuredPosts: Post[];
    filters: {
        category: string;
        search: string;
    };
}

export default function CommunityIndex({ posts, categories, featuredPosts, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [category, setCategory] = useState(filters.category || 'all');
    const [sortBy, setSortBy] = useState('latest');

    const handleSearch = () => {
        router.get('/community', { search, category: category === 'all' ? '' : category, sort: sortBy }, { preserveState: true });
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        router.get('/community', { search, category: value === 'all' ? '' : value, sort: sortBy }, { preserveState: true });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        router.get('/community', { search, category, sort: value }, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Disease Diagnosis': 'bg-red-100 text-red-800 border-red-200',
            'Plant Care': 'bg-green-100 text-green-800 border-green-200',
            'Success Stories': 'bg-blue-100 text-blue-800 border-blue-200',
            'Equipment': 'bg-purple-100 text-purple-800 border-purple-200',
            'General': 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[category] || colors['General'];
    };

    const stats = {
        totalPosts: posts.total,
        totalMembers: 1250, // This could come from props in real app
        todayPosts: (posts.data || []).filter(p => 
            new Date(p.published_at).toDateString() === new Date().toDateString()
        ).length,
        featuredCount: (featuredPosts || []).length
    };

    return (
        <AppLayout>
            <Head title="Community" />
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Users className="h-6 w-6 text-purple-500" />
                                Farmer Community
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Connect with fellow farmers, share experiences, and get help
                            </p>
                        </div>
                        <Link href="/community/create">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="h-4 w-4 mr-2" />
                                New Post
                            </Button>
                        </Link>
                    </div>

                    {/* Community Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                                <div className="text-sm text-gray-400">Total Posts</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-500">{stats.totalMembers}</div>
                                <div className="text-sm text-gray-400">Community Members</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-500">{stats.todayPosts}</div>
                                <div className="text-sm text-gray-400">Posts Today</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-500">{stats.featuredCount}</div>
                                <div className="text-sm text-gray-400">Featured Posts</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filters */}
                    <Card className="bg-gray-900 border-gray-800 mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search posts, topics, or farmers..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                                <Select value={category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="latest">Latest Posts</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="discussed">Most Discussed</SelectItem>
                                        <SelectItem value="unanswered">Unanswered</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Featured Posts */}
                    {((featuredPosts || []).length > 0) && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <h2 className="text-xl font-semibold text-white">Featured Posts</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(featuredPosts || []).slice(0, 2).map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Link href={`/community/${post.id}`}>
                                            <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500 hover:border-purple-400 transition-colors cursor-pointer">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Star className="h-4 w-4 text-yellow-400" />
                                                        <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>
                                                        <Badge variant="outline" className={`text-xs ${getCategoryColor(post.category)}`}>
                                                            {post.category}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-white line-clamp-2">{post.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                                                        {truncateContent(post.content)}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                {post.views}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Heart className="h-3 w-3" />
                                                                {post.likes}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MessageCircle className="h-3 w-3" />
                                                                {(post.comments || []).length}
                                                            </span>
                                                        </div>
                                                        <span>{formatDate(post.published_at)}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Posts */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Recent Discussions</h2>
                            <div className="text-sm text-gray-400">
                                Showing {(posts.data || []).length} of {posts.total} posts
                            </div>
                        </div>

                        {((posts.data || []).length > 0) ? (
                            <div className="space-y-4">
                                {(posts.data || []).map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link href={`/community/${post.id}`}>
                                            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-purple-600 text-white">
                                                                {post.user.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {post.is_pinned && (
                                                                    <Pin className="h-4 w-4 text-yellow-500" />
                                                                )}
                                                                <Badge variant="outline" className={`text-xs ${getCategoryColor(post.category)}`}>
                                                                    {post.category}
                                                                </Badge>
                                                                {(post.tags || []).map(tag => (
                                                                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                                                                        #{tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                            <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                                                {truncateContent(post.content)}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <span>by {post.user.name}</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {formatDate(post.published_at)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Eye className="h-3 w-3" />
                                                                        {post.views}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Heart className="h-3 w-3" />
                                                                        {post.likes}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MessageCircle className="h-3 w-3" />
                                                                        {(post.comments || []).length}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-gray-900 border-gray-800">
                                <CardContent className="text-center py-12">
                                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
                                    <p className="text-gray-400 mb-6">
                                        Be the first to start a conversation in the community!
                                    </p>
                                    <Link href="/community/create">
                                        <Button className="bg-purple-600 hover:bg-purple-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create First Post
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagination */}
                        {posts.last_page > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-2">
                                    {posts.current_page > 1 && (
                                        <Link 
                                            href={`/community?page=${posts.current_page - 1}&search=${search}&category=${category}&sort=${sortBy}`}
                                        >
                                            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                                                Previous
                                            </Button>
                                        </Link>
                                    )}
                                    <span className="flex items-center px-4 text-gray-400">
                                        Page {posts.current_page} of {posts.last_page}
                                    </span>
                                    {posts.current_page < posts.last_page && (
                                        <Link 
                                            href={`/community?page=${posts.current_page + 1}&search=${search}&category=${category}&sort=${sortBy}`}
                                        >
                                            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                                                Next
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/scan">
                            <Card className="bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center text-white">
                                    <Leaf className="h-8 w-8 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">Need Help?</h3>
                                    <p className="text-sm text-green-100">Scan your plant first</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/disease-library">
                            <Card className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center text-white">
                                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">Learn More</h3>
                                    <p className="text-sm text-blue-100">Browse disease library</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/community/create">
                            <Card className="bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center text-white">
                                    <Plus className="h-8 w-8 mx-auto mb-2" />
                                    <h3 className="font-semibold mb-1">Share Experience</h3>
                                    <p className="text-sm text-purple-100">Create a new post</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}