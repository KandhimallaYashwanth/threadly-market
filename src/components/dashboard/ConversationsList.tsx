import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User, Message } from '@/lib/types';

interface ConversationsListProps {
  currentUser: User;
  onSelectWeaver: (weaver: User) => void;
  selectedWeaverId?: string;
}

interface ConversationSummary {
  weaver: User;
  lastMessage?: Message;
  unread: number;
}

const ConversationsList = ({ currentUser, onSelectWeaver, selectedWeaverId }: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    const loadConversations = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const weavers = users.filter((user: User) => user.role === 'weaver');
      
      const messages: Message[] = JSON.parse(localStorage.getItem('messages') || '[]');
      
      const weaverConversations: ConversationSummary[] = weavers.map((weaver: User) => {
        const weaverMessages = messages.filter(msg => 
          (msg.senderId === currentUser.id && msg.receiverId === weaver.id) ||
          (msg.senderId === weaver.id && msg.receiverId === currentUser.id)
        );
        
        weaverMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        const unreadCount = weaverMessages.filter(
          msg => msg.senderId === weaver.id && !msg.isRead
        ).length;
        
        return {
          weaver,
          lastMessage: weaverMessages.length > 0 ? weaverMessages[weaverMessages.length - 1] : undefined,
          unread: unreadCount
        };
      });
      
      weaverConversations.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        
        return new Date(b.lastMessage.createdAt).getTime() - 
               new Date(a.lastMessage.createdAt).getTime();
      });
      
      setConversations(weaverConversations);
    };
    
    loadConversations();
  }, [currentUser]);
  
  const filteredConversations = conversations.filter(
    conv => conv.weaver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div>
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search weavers..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.weaver.id} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                selectedWeaverId === conversation.weaver.id 
                  ? "bg-primary/10" 
                  : conversation.unread > 0 
                    ? "bg-primary/5 hover:bg-primary/10" 
                    : "hover:bg-secondary/80"
              )}
              onClick={() => onSelectWeaver(conversation.weaver)}
            >
              <Avatar>
                <AvatarImage src={conversation.weaver.avatar_url || conversation.weaver.avatar} />
                <AvatarFallback>{conversation.weaver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium truncate">{conversation.weaver.name}</h4>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(conversation.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <p className={cn(
                  "text-sm truncate",
                  conversation.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {conversation.lastMessage 
                    ? conversation.lastMessage.content.length > 30
                      ? conversation.lastMessage.content.substring(0, 30) + '...'
                      : conversation.lastMessage.content
                    : "Start a conversation"}
                </p>
              </div>
              
              {conversation.unread > 0 && (
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
