
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
  selectedWeaver?: User;
  currentUser: User;
}

const ChatSection = ({ selectedWeaver, currentUser }: ChatSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  // Get messages from localStorage or initialize with empty array
  const getMessagesFromStorage = () => {
    if (!selectedWeaver) return [];
    
    try {
      const storedMessages = localStorage.getItem('messages');
      if (!storedMessages) return [];
      
      const allMessages: Message[] = JSON.parse(storedMessages);
      return allMessages.filter(msg => 
        (msg.senderId === currentUser.id && msg.receiverId === selectedWeaver.id) ||
        (msg.senderId === selectedWeaver.id && msg.receiverId === currentUser.id)
      );
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };
  
  const [messages, setMessages] = useState<Message[]>(getMessagesFromStorage());
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!selectedWeaver) return;
    
    try {
      const storedMessages = localStorage.getItem('messages');
      const allMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Filter out existing conversation messages
      const otherMessages = allMessages.filter(msg => 
        !((msg.senderId === currentUser.id && msg.receiverId === selectedWeaver.id) ||
          (msg.senderId === selectedWeaver.id && msg.receiverId === currentUser.id))
      );
      
      // Add current conversation messages
      const updatedMessages = [...otherMessages, ...messages];
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages, selectedWeaver, currentUser]);
  
  // Init conversation if there are no messages and a weaver is selected
  useEffect(() => {
    if (selectedWeaver && messages.length === 0) {
      // Add initial greeting message from weaver
      const initialMessage: Message = {
        id: Date.now().toString(),
        senderId: selectedWeaver.id,
        receiverId: currentUser.id,
        content: `Hello! I'm ${selectedWeaver.name}. How can I help you today?`,
        isRead: false,
        createdAt: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [selectedWeaver, messages.length, currentUser.id]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message function
  const sendMessage = (content: string, isImage = false, isLink = false) => {
    if (!selectedWeaver || (!content.trim() && !isImage)) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedWeaver.id,
      content,
      isRead: false,
      createdAt: new Date(),
      attachments: isImage ? [content] : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    if (!isImage && !isLink) {
      setMessageInput('');
    }
    
    // Simulate weaver response after a delay
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
        senderId: selectedWeaver.id,
        receiverId: currentUser.id,
        content: responseText,
        isRead: false,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      
      // Show notification for new message
      toast.info(`New message from ${selectedWeaver.name}`, {
        description: responseText.slice(0, 50) + (responseText.length > 50 ? '...' : '')
      });
    }, 2000);
  };
  
  // Handle text message submission
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWeaver) return;
    sendMessage(messageInput);
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    if (!selectedWeaver) return;
    fileInputRef.current?.click();
  };
  
  // Process file selection
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedWeaver) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate file upload delay
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
      
      // Reset the input
      e.target.value = '';
    }, 1500);
  };
  
  // Handle link insertion
  const handleSubmitLink = () => {
    if (!selectedWeaver || !linkInput) return;
    
    // Validate URL
    try {
      new URL(linkInput);
      sendMessage(linkInput, false, true);
      setLinkInput('');
      setShowLinkDialog(false);
    } catch (error) {
      toast.error("Please enter a valid URL");
    }
  };
  
  // Parse content for rendering (handle links)
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
    
    // Find and convert links in text
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    if (linkRegex.test(content)) {
      // Split by links
      const parts = content.split(linkRegex);
      const matches = content.match(linkRegex) || [];
      
      return (
        <>
          {parts.map((part, i) => {
            // Return regular text
            if (i === parts.length - 1) {
              return <span key={i}>{part}</span>;
            }
            
            // Return text followed by a link
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
    
    // Regular text
    return content;
  };
  
  // Format time for messages
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // No weaver selected placeholder
  if (!selectedWeaver) {
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
      {/* Chat header */}
      <div className="flex items-center space-x-4 py-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={selectedWeaver.avatar} alt={selectedWeaver.name} />
          <AvatarFallback>{selectedWeaver.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-medium">{selectedWeaver.name}</h2>
          </div>
          <p className="text-xs text-muted-foreground">Artisan</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="py-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = isCurrentUser ? currentUser : selectedWeaver;
            
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
      
      {/* Message input */}
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
