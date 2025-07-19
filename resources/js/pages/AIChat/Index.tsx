import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Plus, MessageSquare, Clock, Archive } from 'lucide-react';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface AIChat {
    id: number;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
    messages: Message[];
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
        return date.toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLastMessage = (messages: Message[]) => {
        if (messages.length === 0) return 'No messages yet';
        const lastMessage = messages[messages.length - 1];
        return lastMessage.content.length > 100 
            ? lastMessage.content.substring(0, 100) + '...' 
            : lastMessage.content;
    };

    return (
        <>
            <Head title="AI Assistant" />
            
            <div className="container mx-auto px-4 py-6">
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
                            <p className="text-muted-foreground">
                                Get expert advice on plant diseases and treatments
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/ai-chat/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Chat
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Quick Start */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            Quick Start
                        </CardTitle>
                        <CardDescription>
                            Start a new conversation or continue from where you left off
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex-col" asChild>
                                <Link href="/ai-chat/create">
                                    <Plus className="h-6 w-6 mb-2" />
                                    <span className="text-sm">New Chat</span>
                                </Link>
                            </Button>
                            
                            <Button variant="outline" className="h-20 flex-col">
                                <MessageSquare className="h-6 w-6 mb-2" />
                                <span className="text-sm">Ask about symptoms</span>
                            </Button>
                            
                            <Button variant="outline" className="h-20 flex-col">
                                <Bot className="h-6 w-6 mb-2" />
                                <span className="text-sm">Treatment advice</span>
                            </Button>
                            
                            <Button variant="outline" className="h-20 flex-col">
                                <Archive className="h-6 w-6 mb-2" />
                                <span className="text-sm">Prevention tips</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Chats */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Chats</h2>
                        <p className="text-muted-foreground">
                            {chats.total} total conversations
                        </p>
                    </div>

                    {chats.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {chats.data.map((chat) => (
                                <Card key={chat.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">
                                                    <Link 
                                                        href={`/ai-chat/${chat.id}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {chat.title || 'Untitled Chat'}
                                                    </Link>
                                                </CardTitle>
                                                <div className="flex gap-2 mb-2">
                                                    <Badge className={getStatusColor(chat.status)}>
                                                        {chat.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {chat.messages.length} messages
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="mb-4 line-clamp-3">
                                            {getLastMessage(chat.messages)}
                                        </CardDescription>
                                        
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {formatDate(chat.updated_at)}
                                            </div>
                                            
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/ai-chat/${chat.id}`}>
                                                    Continue
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start your first conversation with the AI assistant
                                </p>
                                <Button asChild>
                                    <Link href="/ai-chat/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Start New Chat
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-primary" />
                                Expert Knowledge
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Get detailed information about plant diseases, symptoms, and treatment options from our AI expert.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Interactive Conversations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Have natural conversations with the AI assistant to get personalized advice for your specific situation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Archive className="h-5 w-5 text-primary" />
                                Conversation History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Save and revisit your conversations to track your plant health journey over time.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}