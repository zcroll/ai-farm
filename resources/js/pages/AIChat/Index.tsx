import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, MessageSquare, Clock, Trash2 } from 'lucide-react';

interface AIMessage {
    id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
}

interface AIChat {
    id: number;
    title: string;
    model: string;
    is_active: boolean;
    last_activity: string;
    message_count: number;
    last_message?: AIMessage;
}

interface Props {
    chats: {
        data: AIChat[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function AIChatIndex({ chats }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 168) { // 7 days
            const days = Math.floor(diffInHours / 24);
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleDeleteChat = (chatId: number) => {
        if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
            router.delete(`/ai-chat/${chatId}`);
        }
    };

    return (
        <>
            <Head title="AI Chat" />
            <AppShell>
                <div className="container mx-auto py-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">AI Chat</h1>
                            <p className="text-muted-foreground">
                                Get personalized advice about plant diseases and gardening
                            </p>
                        </div>
                        <Link href="/ai-chat/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Chat
                            </Button>
                        </Link>
                    </div>

                    {/* Active Chat */}
                    {chats.data.length > 0 && chats.data[0].is_active && (
                        <Card className="border-green-200 bg-green-50/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            Active
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {chats.data[0].model}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(chats.data[0].last_activity)}
                                    </span>
                                </div>
                                <CardTitle className="text-lg">
                                    <Link 
                                        href={`/ai-chat/${chats.data[0].id}`}
                                        className="hover:text-green-600 transition-colors"
                                    >
                                        {chats.data[0].title || 'Untitled Chat'}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {chats.data[0].last_message && (
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {truncateContent(chats.data[0].last_message.content)}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{chats.data[0].message_count} messages</span>
                                    <Link href={`/ai-chat/${chats.data[0].id}`}>
                                        <Button variant="outline" size="sm">
                                            Continue Chat
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Separator />

                    {/* Chat History */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Chat History</h2>
                        
                        {chats.data.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No chats yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start your first conversation with our AI assistant to get personalized plant care advice.
                                    </p>
                                    <Link href="/ai-chat/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Start New Chat
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chats.data.map((chat) => (
                                    <Card key={chat.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <Badge variant="outline" className="text-xs">
                                                    {chat.model}
                                                </Badge>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteChat(chat.id)}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardTitle className="text-base">
                                                <Link 
                                                    href={`/ai-chat/${chat.id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {chat.title || 'Untitled Chat'}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            {chat.last_message && (
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {truncateContent(chat.last_message.content)}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(chat.last_activity)}</span>
                                                </div>
                                                <span>{chat.message_count} messages</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {chats.last_page > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                {chats.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get('/ai-chat', { 
                                            page: chats.current_page - 1 
                                        })}
                                    >
                                        Previous
                                    </Button>
                                )}
                                
                                <span className="text-sm text-muted-foreground">
                                    Page {chats.current_page} of {chats.last_page}
                                </span>
                                
                                {chats.current_page < chats.last_page && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get('/ai-chat', { 
                                            page: chats.current_page + 1 
                                        })}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </AppShell>
        </>
    );
}