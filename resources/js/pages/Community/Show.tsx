import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Edit3,
  Trash2,
  Send,
  Users,
  Pin,
  Star,
  Bookmark,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Leaf
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email?: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  likes_count: number;
  is_liked: boolean;
  replies?: Comment[];
}

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
  user: User;
  comments: Comment[];
  is_liked: boolean;
  is_bookmarked: boolean;
}

interface Props {
  post: Post;
  auth: {
    user: User;
  };
}

export default function CommunityShow({ post, auth }: Props) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyToComment, setReplyToComment] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);

  const { data, setData, post: submitComment, processing, reset } = useForm({
    content: '',
    parent_id: null as number | null,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Disease Diagnosis': 'bg-red-500 text-white',
      'Plant Care': 'bg-green-500 text-white',
      'Success Stories': 'bg-blue-500 text-white',
      'Equipment': 'bg-purple-500 text-white',
      'General': 'bg-gray-500 text-white',
    };
    return colors[category] || colors['General'];
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(`/community/${post.id}/comments`, {
      onSuccess: () => {
        reset();
        setShowCommentForm(false);
        setReplyToComment(null);
      },
    });
  };

  const handleLikePost = () => {
    router.post(`/community/${post.id}/like`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleLikeComment = (commentId: number) => {
    router.post(`/comments/${commentId}/like`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBookmark = () => {
    router.post(`/community/${post.id}/bookmark`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleReply = (commentId: number) => {
    setReplyToComment(commentId);
    setData('parent_id', commentId);
    setShowCommentForm(true);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 ${isReply ? 'ml-8 border-l-2 border-gray-700' : ''} bg-gray-800 rounded-lg`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-purple-600 text-white text-sm">
            {comment.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.user.name}</span>
            <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
            {comment.updated_at !== comment.created_at && (
              <Badge variant="outline" className="text-xs">Edited</Badge>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-3">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              className={`h-6 px-2 ${comment.is_liked ? 'text-red-400' : 'text-gray-400'} hover:text-red-300`}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.is_liked ? 'fill-current' : ''}`} />
              {comment.likes_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReply(comment.id)}
              className="h-6 px-2 text-gray-400 hover:text-blue-300"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            {comment.user.id === auth.user.id && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingComment(comment.id)}
                  className="h-6 px-2 text-gray-400 hover:text-yellow-300"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.delete(`/comments/${comment.id}`)}
                  className="h-6 px-2 text-gray-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </motion.div>
  );

  return (
    <AppLayout>
      <Head title={post.title} />
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/community">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Community Discussion</h1>
              <p className="text-gray-400 text-sm">Share knowledge and get help from fellow farmers</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`border-gray-700 ${post.is_bookmarked ? 'text-yellow-400' : 'text-white'} hover:bg-gray-800`}
              >
                <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-purple-600 text-white">
                    {post.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {post.is_pinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    {post.is_featured && <Star className="h-4 w-4 text-yellow-500" />}
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl text-white mb-3">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>by {post.user.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views} views
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>
              
              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleLikePost}
                    className={`${post.is_liked ? 'text-red-400' : 'text-gray-400'} hover:text-red-300`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${post.is_liked ? 'fill-current' : ''}`} />
                    {post.likes} Likes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="text-gray-400 hover:text-blue-300"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments.length} Comments
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-green-300">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                {/* Helpful Actions for Farmers */}
                <div className="flex gap-2">
                  <Link href="/scan">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Leaf className="h-3 w-3 mr-1" />
                      Scan Plant
                    </Button>
                  </Link>
                  <Link href="/disease-library">
                    <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Comment Form */}
          {showCommentForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-800 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">
                    {replyToComment ? 'Reply to Comment' : 'Add Your Comment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <Textarea
                      placeholder="Share your experience, ask questions, or provide helpful advice..."
                      value={data.content}
                      onChange={(e) => setData('content', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        💡 Tip: Be specific about your location, plant variety, and growing conditions
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowCommentForm(false);
                            setReplyToComment(null);
                            setData('parent_id', null);
                            reset();
                          }}
                          className="border-gray-700 text-white hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={processing || !data.content.trim()}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {processing ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Comments Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Discussion ({post.comments.length})
                </CardTitle>
                {!showCommentForm && (
                  <Button 
                    onClick={() => setShowCommentForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map(comment => renderComment(comment))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No comments yet</h3>
                  <p className="text-gray-400 mb-6">
                    Be the first to share your thoughts or ask a question!
                  </p>
                  <Button 
                    onClick={() => setShowCommentForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start the Discussion
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/community/create">
              <Card className="bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Ask a Question</h3>
                  <p className="text-sm text-purple-100">Start a new discussion</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/scan">
              <Card className="bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <Leaf className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Diagnose Plant</h3>
                  <p className="text-sm text-green-100">Scan for diseases</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/disease-library">
              <Card className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Learn More</h3>
                  <p className="text-sm text-blue-100">Browse disease info</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 