import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Heart, MessageCircle, Plus, Search, TrendingUp } from 'lucide-react';

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
    const [category, setCategory] = useState(filters.category);

    const handleSearch = () => {
        router.get('/community', { search, category }, { preserveState: true });
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        router.get('/community', { search, category: value }, { preserveState: true });
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
        <>
            <Head title="Community" />
            <AppShell>
                <div className="container mx-auto py-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Community</h1>
                            <p className="text-muted-foreground">
                                Connect with fellow gardeners and share your experiences
                            </p>
                        </div>
                        <Link href="/community/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>

                    {/* Featured Posts */}
                    {featuredPosts.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-orange-500" />
                                <h2 className="text-xl font-semibold">Featured Posts</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featuredPosts.map((post) => (
                                    <Card key={post.id} className="border-orange-200 bg-orange-50/50">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <Badge variant="secondary" className="text-xs">
                                                    {post.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    Featured
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg">
                                                <Link 
                                                    href={`/community/${post.id}`}
                                                    className="hover:text-orange-600 transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {truncateContent(post.content)}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>by {post.user.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {post.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        {post.likes}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch} variant="outline">
                            Search
                        </Button>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {posts.data.map((post) => (
                            <Card key={post.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Badge variant="secondary" className="text-xs">
                                            {post.category}
                                        </Badge>
                                        {post.is_pinned && (
                                            <Badge variant="outline" className="text-xs">
                                                Pinned
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">
                                        <Link 
                                            href={`/community/${post.id}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {truncateContent(post.content)}
                                    </p>
                                    
                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{post.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <span>by {post.user.name}</span>
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>
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
                                                {post.comments.length}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                {posts.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get('/community', { 
                                            page: posts.current_page - 1,
                                            search,
                                            category 
                                        })}
                                    >
                                        Previous
                                    </Button>
                                )}
                                
                                <span className="text-sm text-muted-foreground">
                                    Page {posts.current_page} of {posts.last_page}
                                </span>
                                
                                {posts.current_page < posts.last_page && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get('/community', { 
                                            page: posts.current_page + 1,
                                            search,
                                            category 
                                        })}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {posts.data.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    No posts found matching your criteria.
                                </p>
                                <Link href="/community/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create the First Post
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppShell>
        </>
    );
}