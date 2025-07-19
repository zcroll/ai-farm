import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';
import { useState } from 'react';

export default function CommunityCreate() {
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'general',
        tags: [] as string[],
        image: null as File | null,
    });

    const categories = [
        { value: 'general', label: 'General Discussion' },
        { value: 'question', label: 'Questions' },
        { value: 'experience', label: 'Experiences' },
        { value: 'tip', label: 'Tips & Tricks' },
    ];

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            setData('tags', updatedTags);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        setData('tags', updatedTags);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/community');
    };

    return (
        <AppLayout>
            <Head title="Create Post" />
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Share your plant disease experience or ask questions with the community
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Post Content</CardTitle>
                                    <CardDescription>
                                        Write your post content here. Be descriptive and helpful to the community.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter a descriptive title..."
                                            className="mt-1"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Share your experience, ask questions, or provide tips..."
                                            rows={12}
                                            className="mt-1"
                                        />
                                        {errors.content && (
                                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Post Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="tags">Tags (max 5)</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                id="tags"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Add a tag..."
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addTag}
                                                disabled={!newTag.trim() || tags.length >= 5}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="ml-1 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        {errors.tags && (
                                            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="image">Image (Optional)</Label>
                                        <div className="mt-1">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Posting Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p>• Be respectful and helpful to other community members</p>
                                    <p>• Include relevant details about your plant and symptoms</p>
                                    <p>• Share your location and growing conditions if relevant</p>
                                    <p>• Use clear, descriptive titles</p>
                                    <p>• Add appropriate tags to help others find your post</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Button type="button" variant="outline">
                            Save Draft
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Save className="w-4 h-4 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Publish Post
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}