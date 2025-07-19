import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface AIChatWidgetProps {
    className?: string;
}

export function AIChatWidget({ className }: AIChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user' as const,
            content: inputValue,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Create a new chat if this is the first message
            if (!currentChatId) {
                const response = await fetch('/ai-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentChatId(data.chat.id);
                }
            }

            // Send the message
            if (currentChatId) {
                const response = await fetch(`/ai-chat/${currentChatId}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ message: inputValue }),
                });

                if (response.ok) {
                    // Poll for new messages
                    setTimeout(() => {
                        fetchMessages();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant' as const,
                content: 'Sorry, I encountered an error. Please try again.',
                created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!currentChatId) return;

        try {
            const response = await fetch(`/ai-chat/${currentChatId}/messages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const openFullChat = () => {
        if (currentChatId) {
            router.visit(`/ai-chat/${currentChatId}`);
        } else {
            router.visit('/ai-chat/create');
        }
    };

    if (!isOpen) {
        return (
            <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
                >
                    <Bot className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 w-80 ${className}`}>
            <Card className="shadow-xl border-0">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">AI Assistant</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                            >
                                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openFullChat}
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        <CardContent className="pt-0">
                            <ScrollArea className="h-64 mb-4">
                                <div className="space-y-3">
                                    {messages.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Ask me anything about plant diseases!</p>
                                        </div>
                                    )}
                                    
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                                    message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            <div className="flex space-x-2">
                                <Input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}