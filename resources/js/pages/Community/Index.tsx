import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, SortAsc, SortDesc, MessageSquare, Eye, ThumbsUp, Plus } from 'lucide-react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Disease {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    views_count: number;
    likes_count: number;
    created_at: string;
    user: User;
    disease?: Disease;
    total_comments_count: number;
}

interface CommunityProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        category?: string;
        disease_id?: string;
        search?: string;
        sort_by: string;
        sort_order: string;
    };
    categories: string[];
    diseases: Disease[];
}

export default function Community({ posts, filters, categories, diseases }: CommunityProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [diseaseId, setDiseaseId] = useState(filters.disease_id || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    const applyFilters = () => {
        router.get('/community', {
            search,
            category,
            disease_id: diseaseId,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setDiseaseId('');
        setSortBy('created_at');
        setSortOrder('desc');
        router.get('/community', {}, { preserveState: true, replace: true });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'disease-specific':
                return 'bg-red-100 text-red-800';
            case 'treatment':
                return 'bg-blue-100 text-blue-800';
            case 'prevention':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <Head title="Community" />
            
            <div className="container mx-auto px-4 py-6">
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Community</h1>
                            <p className="text-muted-foreground">
                                Connect with other farmers and share knowledge about plant diseases
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/community/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Post
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search posts..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Disease</label>
                                <Select value={diseaseId} onValueChange={setDiseaseId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All diseases" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All diseases</SelectItem>
                                        {diseases.map((disease) => (
                                            <SelectItem key={disease.id} value={disease.id.toString()}>
                                                {disease.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at">Date</SelectItem>
                                            <SelectItem value="popularity">Popularity</SelectItem>
                                            <SelectItem value="comments">Comments</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Posts */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">
                            Showing {posts.data.length} of {posts.total} posts
                        </p>
                    </div>

                    <div className="space-y-4">
                        {posts.data.map((post) => (
                            <Card key={post.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback>
                                                        {post.user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{post.user.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(post.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <CardTitle className="text-lg mb-2">
                                                <Link 
                                                    href={`/community/${post.id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                            </CardTitle>
                                            
                                            <div className="flex gap-2 mb-3">
                                                <Badge className={getCategoryColor(post.category)}>
                                                    {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Badge>
                                                {post.disease && (
                                                    <Badge variant="outline">{post.disease.name}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4 line-clamp-3">
                                        {post.content}
                                    </CardDescription>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {post.views_count}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                {post.total_comments_count}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="h-4 w-4" />
                                                {post.likes_count}
                                            </div>
                                        </div>
                                        
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/community/${post.id}`}>
                                                Read More
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {posts.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No posts found matching your criteria.</p>
                            <Button variant="outline" onClick={clearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === posts.current_page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => router.get('/community', { 
                                        ...filters, 
                                        page 
                                    }, { preserveState: true })}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}