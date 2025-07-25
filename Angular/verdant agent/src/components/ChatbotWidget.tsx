
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { askEsgChatbot } from "@/ai/flows/esg-chatbot";
import { askEsgChatbotWithFile } from "@/ai/flows/esg-chatbot-with-file";
import { Bot, X, Send, User, MessageSquare, Loader2, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatQuery, setChatQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const chatScrollAreaRef = useRef<HTMLDivElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileDataUri, setFileDataUri] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        if (chatScrollAreaRef.current) {
            setTimeout(() => {
                chatScrollAreaRef.current?.scrollTo({
                    top: chatScrollAreaRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }, 100);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading]);
    
    useEffect(() => {
      if (isOpen && chatHistory.length === 0) {
        setChatHistory([{ role: 'model', content: "Hi! I'm Verdant Path’s digital assistant. How can I help you with your ESG goals today?" }]);
      }
    }, [isOpen, chatHistory.length]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setChatQuery(transcript);
                handleChatSubmit(new Event('submit'), transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                toast({ variant: 'destructive', title: 'Voice Error', description: `Could not recognize speech: ${event.error}` });
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ variant: 'destructive', title: 'File too large', description: 'Please select a file smaller than 2MB.' });
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setFileDataUri(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
            toast({ title: 'File selected', description: `${file.name} is ready to be sent.` });
        }
    };

    const handleChatSubmit = async (e: React.FormEvent | Event, voiceQuery?: string) => {
        e.preventDefault();
        const currentQuery = voiceQuery || chatQuery;
        if (!currentQuery.trim()) return;

        const userMessageContent = selectedFile 
            ? `${currentQuery} (context from: ${selectedFile.name})`
            : currentQuery;

        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userMessageContent }];
        setChatHistory(newHistory);
        setChatQuery('');
        setLoading(true);

        try {
            let res;
            if (selectedFile && fileDataUri) {
                res = await askEsgChatbotWithFile({ query: currentQuery, history: chatHistory, fileDataUri });
            } else {
                res = await askEsgChatbot({ query: currentQuery, history: chatHistory });
            }
            setChatHistory([...newHistory, { role: 'model', content: res.response }]);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'The AI coach is unavailable right now.' });
            setChatHistory(chatHistory); // Revert history on error
        } finally {
            setLoading(false);
            setSelectedFile(null);
            setFileDataUri(null);
            if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        }
    }
    
    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: 'Unsupported', description: 'Your browser does not support voice recognition.' });
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg z-50"
                size="icon"
            >
                {isOpen ? <X /> : <MessageSquare />}
            </Button>
            
            <div className={cn(
                "fixed bottom-24 right-6 z-50 w-[90vw] max-w-[440px] h-[70vh] max-h-[600px] transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}>
                 <Card className="w-full h-full flex flex-col shadow-2xl bg-card/80 backdrop-blur-lg">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="flex items-center gap-2"><Bot /> Verdant Path Assistant</CardTitle>
                        <CardDescription>Your AI-powered guide to ESG goals and strategies.</CardDescription>
                         <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="absolute top-3 right-3">
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-4">
                        <ScrollArea className="h-full pr-4" ref={chatScrollAreaRef}>
                            <div className="space-y-6">
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                                    {msg.role === 'model' && <Bot className="w-8 h-8 text-primary flex-shrink-0" />}
                                    <div className={cn("p-3 rounded-lg max-w-[85%] text-sm shadow-md", msg.role === 'model' ? 'bg-secondary' : 'bg-primary text-primary-foreground')}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                     {msg.role === 'user' && <User className="w-8 h-8 text-accent-foreground flex-shrink-0" />}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <Bot className="w-8 h-8 text-primary flex-shrink-0" />
                                     <div className="p-3 rounded-lg bg-secondary flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                                     </div>
                                </div>
                            )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t border-border/50 pt-4">
                        <form onSubmit={handleChatSubmit} className="w-full flex items-center gap-2">
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.csv,.md,.json" />
                             <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                                <Paperclip className={cn("w-5 h-5", selectedFile && "text-primary")} />
                            </Button>
                             <Button type="button" variant="ghost" size="icon" onClick={toggleListening} disabled={loading}>
                                {isListening ? <Mic className="text-destructive w-5 h-5"/> : <Mic className="w-5 h-5" />}
                            </Button>
                            <Input 
                                value={chatQuery}
                                onChange={(e) => setChatQuery(e.target.value)}
                                placeholder="Ask about ESG or upload a file..."
                                disabled={loading}
                                className="bg-background/80"
                            />
                            <Button type="submit" disabled={loading || (!chatQuery && !selectedFile)} size="icon">
                                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
