import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MessageSquare, Plus, Trash2, Archive, Edit3, Clock } from 'lucide-react';
import { AppLayout } from '@/layouts/app-layout';

interface AIMessage {
    id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
}

interface AIChat {
    id: number;
    title: string;
    status: 'active' | 'archived' | 'deleted';
    created_at: string;
    updated_at: string;
    messages: AIMessage[];
    message_count: number;
    last_message: AIMessage;
}

interface AIChatIndexProps {
    chats: {
        data: AIChat[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function AIChatIndex({ chats }: AIChatIndexProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'archived':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title="AI Chat" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Chat</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Get expert advice on plant diseases and gardening tips
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/ai-chat/create">
                                <Plus className="w-4 h-4 mr-2" />
                                New Chat
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Active Chats */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Conversations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chats.data.filter(chat => chat.status === 'active').map((chat) => (
                            <Card key={chat.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className={getStatusColor(chat.status)}>
                                            {chat.status}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <MessageSquare className="w-4 h-4" />
                                            {chat.message_count}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">
                                        <Link href={`/ai-chat/${chat.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                            {chat.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {chat.last_message && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {truncateContent(chat.last_message.content)}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(chat.updated_at)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/ai-chat/${chat.id}`}>
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Archive className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Archived Chats */}
                {chats.data.filter(chat => chat.status === 'archived').length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Archived Conversations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {chats.data.filter(chat => chat.status === 'archived').map((chat) => (
                                <Card key={chat.id} className="opacity-75 hover:opacity-100 transition-opacity">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className={getStatusColor(chat.status)}>
                                                {chat.status}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <MessageSquare className="w-4 h-4" />
                                                {chat.message_count}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">
                                            <Link href={`/ai-chat/${chat.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                {chat.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chat.last_message && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                                {truncateContent(chat.last_message.content)}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(chat.updated_at)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/ai-chat/${chat.id}`}>
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {chats.data.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Start your first conversation with our AI assistant to get expert advice on plant diseases
                        </p>
                        <Button asChild>
                            <Link href="/ai-chat/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Start New Chat
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Quick Start Tips */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What can I help you with?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="text-center p-4">
                            <Bot className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Disease Diagnosis</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Describe symptoms and get expert diagnosis
                            </p>
                        </Card>
                        <Card className="text-center p-4">
                            <Bot className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Treatment Plans</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Get step-by-step treatment recommendations
                            </p>
                        </Card>
                        <Card className="text-center p-4">
                            <Bot className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Prevention Tips</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Learn how to prevent future outbreaks
                            </p>
                        </Card>
                        <Card className="text-center p-4">
                            <Bot className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Plant Care</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                General gardening and plant care advice
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}