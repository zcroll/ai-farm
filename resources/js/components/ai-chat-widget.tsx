import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatWidgetProps {
  className?: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI plant health assistant. I can help you with plant disease identification, treatment advice, and gardening tips. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/ai-chat/message', {
        message: userMessage.content,
        model: 'gemini-2.0-flash',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        withCredentials: true
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message || 'I apologize, but I couldn\'t process your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI Chat Error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, but I encountered an error. Please try again later or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen && !isMinimized) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 h-96 bg-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-green-400" />
                    <CardTitle className="text-white text-lg">AI Assistant</CardTitle>
                    <Badge variant="secondary" className="text-xs">Plant Health</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {!isMinimized && (
                <CardContent className="p-0 h-80">
                  <ScrollArea className="h-64 px-4">
                    <div className="space-y-4 pb-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex-shrink-0">
                              <Bot className="h-6 w-6 text-green-400" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              message.role === 'user'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-800 text-gray-200'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-green-200' : 'text-gray-400'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="flex-shrink-0">
                              <User className="h-6 w-6 text-blue-400" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="flex-shrink-0">
                            <Bot className="h-6 w-6 text-green-400" />
                          </div>
                          <div className="bg-gray-800 rounded-lg px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                              <span className="text-gray-300">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {error && (
                    <div className="px-4 pb-2">
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}
                  
                  <div className="p-4 pt-0">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about plant health..."
                        className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleChat}
          className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AIChatWidget;