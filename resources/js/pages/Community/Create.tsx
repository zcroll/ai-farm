import { Head, useForm, router } from '@inertiajs/react';
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
import { ArrowLeft, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SuccessNotification from '@/components/success-notification';

export default function CommunityCreate() {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'general',
        tags: [] as string[],
        image: null as File | null,
    });

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!data.title.trim()) {
            errors.title = 'Title is required';
        } else if (data.title.length < 5) {
            errors.title = 'Title must be at least 5 characters long';
        } else if (data.title.length > 100) {
            errors.title = 'Title must be less than 100 characters';
        }

        if (!data.content.trim()) {
            errors.content = 'Content is required';
        } else if (data.content.length < 20) {
            errors.content = 'Content must be at least 20 characters long';
        } else if (data.content.length > 5000) {
            errors.content = 'Content must be less than 5000 characters';
        }

        if (!data.category) {
            errors.category = 'Category is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setShowConfirmDialog(true);
    };

    const confirmSubmit = () => {
        setShowConfirmDialog(false);
        post('/community', {
            onSuccess: () => {
                setShowSuccessNotification(true);
                // Form will redirect on success
            },
            onError: (errors) => {
                setValidationErrors(errors);
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

    const allErrors = { ...errors, ...validationErrors };

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
                                        className={allErrors.title ? 'border-red-500' : ''}
                                    />
                                    {allErrors.title && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{allErrors.title}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger className={allErrors.category ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="question">Question</SelectItem>
                                            <SelectItem value="experience">Experience</SelectItem>
                                            <SelectItem value="tip">Tip</SelectItem>
                                            <SelectItem value="disease">Disease Help</SelectItem>
                                            <SelectItem value="treatment">Treatment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {allErrors.category && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{allErrors.category}</AlertDescription>
                                        </Alert>
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
                                        className={allErrors.content ? 'border-red-500' : ''}
                                    />
                                    {allErrors.content && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{allErrors.content}</AlertDescription>
                                        </Alert>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        You can use Markdown formatting for better presentation. 
                                        {data.content.length > 0 && (
                                            <span className={`ml-2 ${data.content.length > 5000 ? 'text-red-500' : 'text-green-500'}`}>
                                                {data.content.length}/5000 characters
                                            </span>
                                        )}
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
                                            <h3 className="text-lg font-semibold">{data.title}</h3>
                                            <Badge variant="secondary" className="mt-1">
                                                {data.category}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {data.content}
                                        </p>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Link href="/community">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={processing || !data.title.trim() || !data.content.trim()}
                                className="min-w-[120px]"
                            >
                                {processing ? 'Creating...' : 'Create Post'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Post Creation</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to create this post? Once published, it will be visible to the community.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">Post Details:</h4>
                                <div className="mt-2 space-y-2 text-sm">
                                    <div><strong>Title:</strong> {data.title}</div>
                                    <div><strong>Category:</strong> {data.category}</div>
                                    <div><strong>Content Length:</strong> {data.content.length} characters</div>
                                    {tags.length > 0 && (
                                        <div><strong>Tags:</strong> {tags.join(', ')}</div>
                                    )}
                                    {data.image && (
                                        <div><strong>Image:</strong> {data.image.name}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmSubmit} disabled={processing}>
                                {processing ? 'Creating...' : 'Create Post'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Success Notification */}
                <SuccessNotification
                    message="Post created successfully! Redirecting to community..."
                    isVisible={showSuccessNotification}
                    onClose={() => setShowSuccessNotification(false)}
                    duration={3000}
                />
            </AppShell>
        </>
    );
}