
import { FabricType, OrderStatus, Product, User, UserRole } from './types';

// Re-export the types so they can be imported from data.ts as well
export { FabricType, OrderStatus, UserRole };

// Mock Weavers
export const weavers: User[] = [
  {
    id: 'w1',
    name: 'Aruna Patel',
    email: 'aruna@example.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Third-generation silk weaver specializing in traditional Banarasi designs with 15 years of experience.',
    isVerified: true,
    createdAt: new Date('2022-01-10')
  },
  {
    id: 'w2',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Specializing in cotton handloom with natural dyes, creating sustainable and eco-friendly fabrics.',
    isVerified: true,
    createdAt: new Date('2022-03-15')
  },
  {
    id: 'w3',
    name: 'Lakshmi Devi',
    email: 'lakshmi@example.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Award-winning master weaver known for intricate jute and linen blends with contemporary designs.',
    isVerified: true,
    createdAt: new Date('2022-05-20')
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Specializing in woolen shawls and blankets using traditional hill station techniques passed down generations.',
    isVerified: false,
    createdAt: new Date('2022-08-05')
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Banarasi Silk Saree',
    description: 'Luxurious handwoven Banarasi silk saree with intricate gold zari work. This piece represents centuries of tradition and craftsmanship, perfect for special occasions and celebrations.',
    images: [
      'https://images.unsplash.com/photo-1591745243620-674993fda2d8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1610261041212-363b2a424c22?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 12500,
    fabricType: FabricType.SILK,
    weaverId: 'w1',
    inStock: true,
    rating: 4.8,
    reviewCount: 24,
    tags: ['saree', 'wedding', 'traditional', 'premium'],
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'p2',
    name: 'Handloom Cotton Dress Material',
    description: 'Breathable handloom cotton fabric for dresses, featuring a unique block-printed design using natural indigo dye. Perfect for creating comfortable yet stylish everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=1415&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1649264857865-54c36f9f5a5e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 1800,
    discount: 10,
    fabricType: FabricType.COTTON,
    weaverId: 'w2',
    inStock: true,
    rating: 4.6,
    reviewCount: 18,
    tags: ['cotton', 'dress', 'sustainable', 'casual'],
    createdAt: new Date('2023-02-10')
  },
  {
    id: 'p3',
    name: 'Jute-Linen Blend Table Runner',
    description: 'Eco-friendly table runner made from a unique jute-linen blend, featuring contemporary geometric patterns. Each piece is carefully handwoven to add a touch of artisanal elegance to your dining space.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1540639822097-92cd824f2184?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 2200,
    fabricType: FabricType.MIXED,
    weaverId: 'w3',
    inStock: true,
    rating: 4.9,
    reviewCount: 32,
    tags: ['home', 'table', 'eco-friendly', 'decor'],
    createdAt: new Date('2023-03-05')
  },
  {
    id: 'p4',
    name: 'Traditional Woolen Shawl',
    description: 'Hand-spun and hand-woven woolen shawl made using ancient techniques from the Himalayan region. This luxuriously warm piece features traditional patterns and natural dyes.',
    images: [
      'https://images.unsplash.com/photo-1617711323454-fea3df444071?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1607779097040-29ca8111839e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 3500,
    discount: 5,
    fabricType: FabricType.WOOL,
    weaverId: 'w4',
    inStock: false,
    rating: 4.7,
    reviewCount: 15,
    tags: ['winter', 'accessory', 'traditional', 'gift'],
    createdAt: new Date('2023-04-20')
  },
  {
    id: 'p5',
    name: 'Handwoven Silk Stole',
    description: 'Elegant silk stole with delicate zari borders, perfect as an accessory for formal occasions or as a luxurious gift. Each piece showcases the finesse of traditional silk weaving.',
    images: [
      'https://images.unsplash.com/photo-1633934542430-0a3c17c51d35?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1581363111685-9f05bf1526af?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 2800,
    fabricType: FabricType.SILK,
    weaverId: 'w1',
    inStock: true,
    rating: 4.5,
    reviewCount: 9,
    tags: ['accessory', 'formal', 'gift', 'lightweight'],
    createdAt: new Date('2023-05-10')
  },
  {
    id: 'p6',
    name: 'Organic Cotton Shirt Fabric',
    description: 'Premium organic cotton fabric for shirts, featuring a subtle herringbone weave. Sustainably produced using natural dyes and traditional handloom techniques for maximum comfort and minimal environmental impact.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1565366596315-13baa9a25c8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 1500,
    discount: 15,
    fabricType: FabricType.COTTON,
    weaverId: 'w2',
    inStock: true,
    rating: 4.4,
    reviewCount: 12,
    tags: ['men', 'organic', 'sustainable', 'casual'],
    createdAt: new Date('2023-06-15')
  },
  {
    id: 'p7',
    name: 'Jute Wall Hanging',
    description: 'Artistic wall hanging crafted from handwoven jute, designed to add texture and warmth to your living space. Each piece is uniquely created with natural variations in the weave pattern.',
    images: [
      'https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 2000,
    fabricType: FabricType.JUTE,
    weaverId: 'w3',
    inStock: true,
    rating: 4.8,
    reviewCount: 7,
    tags: ['home', 'decor', 'wall', 'eco-friendly'],
    createdAt: new Date('2023-07-20')
  },
  {
    id: 'p8',
    name: 'Merino Wool Scarf',
    description: 'Luxuriously soft merino wool scarf handwoven with a twill pattern. This versatile accessory provides exceptional warmth while maintaining a lightweight feel, perfect for chilly evenings.',
    images: [
      'https://images.unsplash.com/photo-1483103068651-8bd14a347f3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1569379591098-39c0e0cec261?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    price: 2800,
    fabricType: FabricType.WOOL,
    weaverId: 'w4',
    inStock: true,
    rating: 4.6,
    reviewCount: 14,
    tags: ['accessory', 'winter', 'premium', 'gift'],
    createdAt: new Date('2023-08-10')
  }
];

// Associate weavers with products
export const productsWithWeavers = products.map(product => {
  const weaver = weavers.find(w => w.id === product.weaverId);
  return {
    ...product,
    weaver
  };
});

// Mock customers
export const customers: User[] = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date('2022-06-15')
  },
  {
    id: 'c2',
    name: 'Aditya Kapoor',
    email: 'aditya@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1399&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date('2022-07-20')
  },
  {
    id: 'c3',
    name: 'Nisha Gupta',
    email: 'nisha@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    createdAt: new Date('2022-09-05')
  }
];

// Sample order statuses for dashboard
export const orderStatusData = [
  { status: OrderStatus.PENDING, count: 12 },
  { status: OrderStatus.PROCESSING, count: 8 },
  { status: OrderStatus.WEAVING, count: 15 },
  { status: OrderStatus.SHIPPED, count: 10 },
  { status: OrderStatus.DELIVERED, count: 25 },
  { status: OrderStatus.CANCELLED, count: 3 }
];

// Sample monthly sales data for the weaver dashboard
export const monthlySalesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 15000 },
  { month: 'Mar', sales: 18000 },
  { month: 'Apr', sales: 16000 },
  { month: 'May', sales: 21000 },
  { month: 'Jun', sales: 19000 },
  { month: 'Jul', sales: 22000 },
  { month: 'Aug', sales: 25000 },
  { month: 'Sep', sales: 23000 },
  { month: 'Oct', sales: 20000 },
  { month: 'Nov', sales: 27000 },
  { month: 'Dec', sales: 32000 }
];

// Sample fabric type sales data for the weaver dashboard
export const fabricTypeSalesData = [
  { name: 'Cotton', value: 35 },
  { name: 'Silk', value: 30 },
  { name: 'Linen', value: 15 },
  { name: 'Wool', value: 10 },
  { name: 'Jute', value: 7 },
  { name: 'Mixed', value: 3 }
];
