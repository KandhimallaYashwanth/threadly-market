
export enum UserRole {
  CUSTOMER = 'customer',
  WEAVER = 'weaver',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  createdAt: Date;
  password?: string; // For demo users only
}

export enum FabricType {
  COTTON = 'cotton',
  SILK = 'silk',
  LINEN = 'linen',
  WOOL = 'wool',
  JUTE = 'jute',
  MIXED = 'mixed'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  discount?: number;
  fabricType: FabricType;
  weaverId: string;
  weaver?: User;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  createdAt: Date;
  codAvailable: boolean; // Changed from optional to required
  upiEnabled: boolean; // Changed from optional to required
  cardEnabled: boolean; // Added for completeness
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  WEAVING = 'weaving',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CARD = 'card',
  UPI = 'upi',
  COD = 'cod'
}

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: User;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customer?: User;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

// Add default users for demo
export const DEFAULT_USERS: User[] = [
  {
    id: 'w1',
    name: 'Aruna Patel',
    email: 'arunapatel@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Expert in traditional silk sarees with over 20 years of experience',
    createdAt: new Date(2022, 1, 15)
  },
  {
    id: 'w2',
    name: 'Rajesh Kumar',
    email: 'rajeshkumar@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Specializes in cotton fabrics with natural dyes',
    createdAt: new Date(2022, 3, 10)
  },
  {
    id: 'w3',
    name: 'Lakshmi Devi',
    email: 'lakshmidevi@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Award-winning weaver specializing in intricate designs',
    createdAt: new Date(2022, 5, 22)
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    email: 'vikramsingh@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Third generation weaver focusing on sustainable practices',
    createdAt: new Date(2022, 7, 5)
  },
  {
    id: 'c1',
    name: 'Customer',
    email: 'customer@gmail.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date(2022, 9, 18)
  }
];
