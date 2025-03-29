
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Paperclip, Image } from 'lucide-react';
import { weavers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Defining a simple message interface for the chat
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isImage?: boolean;
}

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Find the weaver by ID
  const weaver = weavers.find(w => w.id === id);
  
  // Mock user for demo
  const currentUser = {
    id: 'c1',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  };
  
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: id as string,
      receiverId: currentUser.id,
      content: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ]);
  
  const [messageInput, setMessageInput] = useState('');
  
  // Handle if weaver not found
  if (!weaver) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Weaver Not Found</h1>
            <p className="text-muted-foreground mb-8">The weaver you are trying to chat with does not exist.</p>
            <Button asChild>
              <div onClick={() => navigate('/weavers')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Weavers
              </div>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Send message function
  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: weaver.id,
      content: messageInput,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Simulate weaver response after a delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: weaver.id,
        receiverId: currentUser.id,
        content: `Thank you for your message! I'll get back to you as soon as possible.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    toast.info('File upload feature coming soon!');
  };
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Format time for messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Chat header */}
          <div className="flex items-center space-x-4 py-4 border-b">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={weaver.avatar} alt={weaver.name} />
              <AvatarFallback>{weaver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-medium">{weaver.name}</h2>
              <p className="text-xs text-muted-foreground">
                {weaver.isVerified ? 'Verified Artisan' : 'Artisan'}
              </p>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="py-6 h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUser.id;
                const sender = isCurrentUser ? currentUser : weaver;
                
                return (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex items-end space-x-2",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sender.avatar} alt={sender.name} />
                        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div 
                      className={cn(
                        "max-w-md px-4 py-2 rounded-lg",
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground rounded-br-none" 
                          : "bg-secondary text-secondary-foreground rounded-bl-none"
                      )}
                    >
                      {message.isImage ? (
                        <img 
                          src={message.content} 
                          alt="Shared image" 
                          className="rounded-md max-h-48 w-auto object-contain"
                        />
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <span 
                        className={cn(
                          "text-xs block mt-1",
                          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}
                      >
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                    
                    {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sender.avatar} alt={sender.name} />
                        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input */}
          <div className="py-4 border-t">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex space-x-2"
            >
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={handleFileUpload}
              >
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={handleFileUpload}
              >
                <Image className="h-5 w-5" />
                <span className="sr-only">Send image</span>
              </Button>
              
              <Input 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Chat;
