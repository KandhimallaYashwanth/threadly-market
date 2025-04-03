
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
  avatar_url?: string;
  // Adding avatar for backward compatibility with existing code
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  createdAt: Date;
  // Add these for extended functionality in components
  productCount?: number;
  averageRating?: number;
  isPublic?: boolean; // Add this for weaver profile visibility control
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
  codAvailable: boolean;
  upiEnabled: boolean;
  cardEnabled: boolean;
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
  weaverId: string; // Add weaver ID for tracking orders per weaver
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
