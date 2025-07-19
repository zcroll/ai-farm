import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function CommunityCreate() {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'general',
        tags: [] as string[],
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/community', {
            onSuccess: () => {
                // Form will redirect on success
            },
        });
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setData('tags', newTags);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setData('tags', newTags);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <>
            <Head title="Create Post - Community" />
            <AppShell>
                <div className="container mx-auto py-6 max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/community">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Community
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Post</h1>
                            <p className="text-muted-foreground">
                                Share your gardening experience, ask questions, or provide tips
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter a descriptive title for your post..."
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="question">Question</SelectItem>
                                            <SelectItem value="experience">Experience</SelectItem>
                                            <SelectItem value="tip">Tip</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-red-500">{errors.category}</p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Share your gardening story, question, or advice..."
                                        rows={10}
                                        className={errors.content ? 'border-red-500' : ''}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-500">{errors.content}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        You can use Markdown formatting for better presentation
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add tags (press Enter to add)"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addTag}
                                            disabled={!tagInput.trim() || tags.length >= 10}
                                        >
                                            <Plus className="h-4 w-4" />
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
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Add up to 10 tags to help others find your post
                                    </p>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image (Optional)</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload an image to illustrate your post (max 2MB)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        {data.title && data.content && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold">{data.title}</h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary">{data.category}</Badge>
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="outline">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="prose prose-sm max-w-none">
                                            <p className="whitespace-pre-wrap">{data.content}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link href="/community">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppShell>
        </>
    );
}