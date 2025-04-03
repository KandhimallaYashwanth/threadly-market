import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Paperclip, 
  Link as LinkIcon,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { User, Message } from '@/lib/types';

interface ChatSectionProps {
  currentUser: User;
  receiver?: User;
  selectedWeaver?: User;
}

const ChatSection = ({ selectedWeaver, currentUser, receiver }: ChatSectionProps) => {
  const activeWeaver = receiver || selectedWeaver;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  const getMessagesFromStorage = () => {
    if (!activeWeaver) return [];
    
    try {
      const storedMessages = localStorage.getItem('messages');
      if (!storedMessages) return [];
      
      const allMessages: Message[] = JSON.parse(storedMessages);
      return allMessages.filter(msg => 
        (msg.senderId === currentUser.id && msg.receiverId === activeWeaver.id) ||
        (msg.senderId === activeWeaver.id && msg.receiverId === currentUser.id)
      );
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };
  
  const [messages, setMessages] = useState<Message[]>(getMessagesFromStorage());
  
  useEffect(() => {
    if (!activeWeaver) return;
    
    try {
      const storedMessages = localStorage.getItem('messages');
      const allMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
      
      const otherMessages = allMessages.filter(msg => 
        !((msg.senderId === currentUser.id && msg.receiverId === activeWeaver.id) ||
          (msg.senderId === activeWeaver.id && msg.receiverId === currentUser.id))
      );
      
      const updatedMessages = [...otherMessages, ...messages];
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages, activeWeaver, currentUser]);
  
  useEffect(() => {
    if (activeWeaver && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        senderId: activeWeaver.id,
        receiverId: currentUser.id,
        content: `Hello! I'm ${activeWeaver.name}. How can I help you today?`,
        isRead: false,
        createdAt: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [activeWeaver, messages.length, currentUser.id]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = (content: string, isImage = false, isLink = false) => {
    if (!activeWeaver || (!content.trim() && !isImage)) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: activeWeaver.id,
      content,
      isRead: false,
      createdAt: new Date(),
      attachments: isImage ? [content] : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    if (!isImage && !isLink) {
      setMessageInput('');
    }
    
    setTimeout(() => {
      let responseText = "Thank you for your message! I'll get back to you soon.";
      
      if (isImage) {
        responseText = "Thanks for sharing that image! It helps me understand what you're looking for.";
      } else if (isLink) {
        responseText = "Thanks for sharing that link! I'll check it out.";
      } else if (content.toLowerCase().includes('custom') || content.toLowerCase().includes('order')) {
        responseText = "I'd be happy to discuss a custom order with you. Please share more details about what you're looking for.";
      }
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeWeaver.id,
        receiverId: currentUser.id,
        content: responseText,
        isRead: false,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      
      toast.info(`New message from ${activeWeaver.name}`, {
        description: responseText.slice(0, 50) + (responseText.length > 50 ? '...' : '')
      });
    }, 2000);
  };
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWeaver) return;
    sendMessage(messageInput);
  };
  
  const handleFileUpload = () => {
    if (!activeWeaver) return;
    fileInputRef.current?.click();
  };
  
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeWeaver) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageUrl = reader.result as string;
        sendMessage(imageUrl, true);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Failed to upload image");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
      
      e.target.value = '';
    }, 1500);
  };
  
  const handleSubmitLink = () => {
    if (!activeWeaver || !linkInput) return;
    
    try {
      new URL(linkInput);
      sendMessage(linkInput, false, true);
      setLinkInput('');
      setShowLinkDialog(false);
    } catch (error) {
      toast.error("Please enter a valid URL");
    }
  };
  
  const parseContent = (content: string, isLink = false) => {
    if (isLink) {
      return (
        <a 
          href={content} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline break-all"
        >
          {content}
        </a>
      );
    }
    
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    if (linkRegex.test(content)) {
      const parts = content.split(linkRegex);
      const matches = content.match(linkRegex) || [];
      
      return (
        <>
          {parts.map((part, i) => {
            if (i === parts.length - 1) {
              return <span key={i}>{part}</span>;
            }
            
            return (
              <React.Fragment key={i}>
                {part}
                <a 
                  href={matches[i]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline break-all"
                >
                  {matches[i]}
                </a>
              </React.Fragment>
            );
          })}
        </>
      );
    }
    
    return content;
  };
  
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!activeWeaver) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
          <p className="text-muted-foreground">Select a weaver to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 py-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={activeWeaver.avatar || activeWeaver.avatar_url} alt={activeWeaver.name} />
          <AvatarFallback>{activeWeaver.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-medium">{activeWeaver.name}</h2>
          </div>
          <p className="text-xs text-muted-foreground">Artisan</p>
        </div>
      </div>
      
      <div className="py-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = isCurrentUser ? currentUser : activeWeaver;
            
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
                  {message.attachments && message.attachments.length > 0 ? (
                    <a 
                      href={message.attachments[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={message.attachments[0]} 
                        alt="Shared image" 
                        className="rounded-md max-h-48 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <p className="whitespace-pre-line">
                      {parseContent(DOMPurify.sanitize(message.content))}
                    </p>
                  )}
                  <span 
                    className={cn(
                      "text-xs block mt-1",
                      isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatMessageTime(message.createdAt)}
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
      
      <div className="py-4 border-t">
        <form 
          onSubmit={handleSubmitMessage}
          className="flex space-x-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            onClick={handleFileUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
              >
                <LinkIcon className="h-5 w-5" />
                <span className="sr-only">Add link</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share a link</DialogTitle>
                <DialogDescription>
                  Insert a URL to share in the conversation.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">Link</Label>
                  <Input
                    id="link"
                    placeholder="https://example.com"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSubmitLink}>
                  Insert Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Input 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          
          <Button 
            type="submit" 
            size="icon"
            disabled={!messageInput.trim() && !isUploading}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
