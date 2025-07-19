import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart, MessageSquare, Plus, Search, TrendingUp, Users } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';

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
        email: string;
    };
    comments: Array<{
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
        };
    }>;
}

interface CommunityIndexProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Record<string, string>;
    featuredPosts: Post[];
    filters: {
        category: string;
        search: string;
    };
}

export default function CommunityIndex({ posts, categories, featuredPosts, filters }: CommunityIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [category, setCategory] = useState(filters.category);

    const handleSearch = () => {
        router.get('/community', { search, category }, { preserveState: true });
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        router.get('/community', { search, category: newCategory }, { preserveState: true });
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

    return (
        <AppLayout>
            <Head title="Community" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Connect with fellow gardeners and share your plant disease experiences
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/community/create">
                                <Plus className="w-4 h-4 mr-2" />
                                New Post
                            </Link>
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search posts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(categories).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch} className="w-full sm:w-auto">
                            Search
                        </Button>
                    </div>
                </div>

                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Posts</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
                                <Card key={post.id} className="border-orange-200 dark:border-orange-800">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                Featured
                                            </Badge>
                                            <Badge variant="outline">{categories[post.category]}</Badge>
                                        </div>
                                        <CardTitle className="text-lg">
                                            <Link href={`/community/${post.id}`} className="hover:text-orange-600 dark:hover:text-orange-400">
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {truncateContent(post.content)}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {post.views}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-4 h-4" />
                                                    {post.likes}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {post.comments.length}
                                                </div>
                                            </div>
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Posts */}
                <div className="space-y-6">
                    {posts.data.map((post) => (
                        <Card key={post.id} className={post.is_pinned ? 'border-blue-200 dark:border-blue-800' : ''}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {post.is_pinned && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    Pinned
                                                </Badge>
                                            )}
                                            <Badge variant="outline">{categories[post.category]}</Badge>
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <CardTitle className="text-xl mb-2">
                                            <Link href={`/community/${post.id}`} className="hover:text-orange-600 dark:hover:text-orange-400">
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {truncateContent(post.content, 200)}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src="" />
                                                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {post.user.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(post.published_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {post.views}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {post.likes}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {post.comments.length}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2">
                            {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === posts.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get('/community', { 
                                        page, 
                                        search, 
                                        category 
                                    }, { preserveState: true })}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {posts.data.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {search || category !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'Be the first to share your plant disease experience!'
                            }
                        </p>
                        {!search && category === 'all' && (
                            <Button asChild>
                                <Link href="/community/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Post
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}