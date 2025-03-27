
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Link as LinkIcon,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { weavers } from '@/lib/data';
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
import { Textarea } from '@/components/ui/textarea';
import { requireAuth, getCurrentUser } from '@/lib/auth';

// Defining message interfaces
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isImage?: boolean;
  isLink?: boolean;
}

interface CustomOrderRequest {
  productType: string;
  description: string;
  budget: string;
  timeline: string;
}

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Find the weaver by ID
  const weaver = weavers.find(w => w.id === id);
  
  // Get current user
  const currentUser = getCurrentUser() || {
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
  const [customOrder, setCustomOrder] = useState<CustomOrderRequest>({
    productType: '',
    description: '',
    budget: '',
    timeline: ''
  });
  const [linkInput, setLinkInput] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  // Check authentication when component mounts
  useEffect(() => {
    requireAuth(navigate);
  }, [navigate]);
  
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
  const sendMessage = (content: string, isImage = false, isLink = false) => {
    if (!content.trim() && !isImage) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: weaver.id,
      content,
      timestamp: new Date(),
      isImage,
      isLink
    };
    
    setMessages([...messages, newMessage]);
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
        senderId: weaver.id,
        receiverId: currentUser.id,
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      
      // Show notification for new message
      toast.info("New message from " + weaver.name, {
        description: responseText.slice(0, 50) + (responseText.length > 50 ? '...' : '')
      });
    }, 2000);
  };
  
  // Handle text message submission
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(messageInput);
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Process file selection
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!linkInput) return;
    
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
  
  // Handle custom order submission
  const handleSubmitCustomOrder = () => {
    // Validate form
    if (!customOrder.productType || !customOrder.description || !customOrder.budget) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Format the custom order as a structured message
    const orderMessage = `
      📋 Custom Order Request:
      
      📦 Product: ${customOrder.productType}
      💰 Budget: ₹${customOrder.budget}
      ⏱️ Timeline: ${customOrder.timeline || 'Flexible'}
      
      📝 Details: ${customOrder.description}
    `;
    
    sendMessage(orderMessage);
    
    // Reset form
    setCustomOrder({
      productType: '',
      description: '',
      budget: '',
      timeline: ''
    });
    
    toast.success("Custom order request sent!");
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
              <div className="flex items-center gap-2">
                <h2 className="font-medium">{weaver.name}</h2>
                {weaver.isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {weaver.isVerified ? 'Verified Artisan' : 'Artisan'}
              </p>
            </div>
            
            {/* Custom Order Button */}
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Custom Order</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Custom Order</DialogTitle>
                    <DialogDescription>
                      Describe what you'd like {weaver.name} to create for you.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-type">What would you like?</Label>
                      <Input 
                        id="product-type" 
                        placeholder="e.g., Silk Saree, Table Runner, etc." 
                        value={customOrder.productType}
                        onChange={(e) => setCustomOrder({...customOrder, productType: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Details</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe colors, patterns, size, and other specific requirements..." 
                        className="min-h-[100px]"
                        value={customOrder.description}
                        onChange={(e) => setCustomOrder({...customOrder, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (₹)</Label>
                        <Input 
                          id="budget" 
                          type="number" 
                          placeholder="Your budget" 
                          value={customOrder.budget}
                          onChange={(e) => setCustomOrder({...customOrder, budget: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Timeline (optional)</Label>
                        <Input 
                          id="timeline" 
                          placeholder="e.g., 2 weeks, 1 month" 
                          value={customOrder.timeline}
                          onChange={(e) => setCustomOrder({...customOrder, timeline: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmitCustomOrder}>Send Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                        <a 
                          href={message.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <img 
                            src={message.content} 
                            alt="Shared image" 
                            className="rounded-md max-h-48 w-auto object-contain"
                          />
                        </a>
                      ) : (
                        <p className="whitespace-pre-line">
                          {message.isLink 
                            ? parseContent(message.content, true) 
                            : parseContent(DOMPurify.sanitize(message.content))}
                        </p>
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
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
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
      </main>
      <Footer />
    </>
  );
};

export default Chat;
