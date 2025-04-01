
import { FabricType, OrderStatus, Product, User, UserRole, Message } from './types';

// Re-export the types so they can be imported from data.ts as well
export { FabricType, OrderStatus, UserRole };

// Mock Weavers
export const weavers: User[] = [
  {
    id: 'w1',
    name: 'Aruna Patel',
    email: 'arunapatel@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Third-generation silk weaver specializing in traditional Banarasi designs with 15 years of experience.',
    isVerified: true,
    createdAt: new Date('2022-01-10')
  },
  {
    id: 'w2',
    name: 'Rajesh Kumar',
    email: 'rajeshkumar@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Specializing in cotton handloom with natural dyes, creating sustainable and eco-friendly fabrics.',
    isVerified: true,
    createdAt: new Date('2022-03-15')
  },
  {
    id: 'w3',
    name: 'Lakshmi Devi',
    email: 'lakshmidevi@gmail.com',
    role: UserRole.WEAVER,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Award-winning master weaver known for intricate jute and linen blends with contemporary designs.',
    isVerified: true,
    createdAt: new Date('2022-05-20')
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    email: 'vikramsingh@gmail.com',
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
    createdAt: new Date('2023-01-15'),
    codAvailable: true,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-02-10'),
    codAvailable: true,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-03-05'),
    codAvailable: false,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-04-20'),
    codAvailable: false,
    upiEnabled: false,
    cardEnabled: true
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
    createdAt: new Date('2023-05-10'),
    codAvailable: true,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-06-15'),
    codAvailable: true,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-07-20'),
    codAvailable: false,
    upiEnabled: true,
    cardEnabled: true
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
    createdAt: new Date('2023-08-10'),
    codAvailable: true,
    upiEnabled: true,
    cardEnabled: true
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
    name: 'Default Customer',
    email: 'customer@gmail.com',
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

// Default demo messages
export const defaultMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'c1',
    receiverId: 'w1',
    content: 'Hello, I\'m interested in your Banarasi Silk Saree. Is it available in red color?',
    isRead: true,
    createdAt: new Date('2023-08-15T10:30:00')
  },
  {
    id: 'm2',
    senderId: 'w1',
    receiverId: 'c1',
    content: 'Hello! Thank you for your interest. Yes, we do have it in red color. Would you like to see some pictures?',
    isRead: true,
    createdAt: new Date('2023-08-15T11:15:00')
  },
  {
    id: 'm3',
    senderId: 'c1',
    receiverId: 'w1',
    content: "That would be great! Also, what's the delivery time for this item?",
    isRead: true,
    createdAt: new Date('2023-08-15T11:20:00')
  },
  {
    id: 'm4',
    senderId: 'w1',
    receiverId: 'c1',
    content: 'We usually ship within 2-3 business days, and delivery takes about 5-7 days depending on your location. Here are some pictures of the red variant.',
    isRead: true,
    attachments: ['https://images.unsplash.com/photo-1612722432474-b971cdcea546?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3'],
    createdAt: new Date('2023-08-15T11:45:00')
  },
  {
    id: 'm5',
    senderId: 'c1',
    receiverId: 'w2',
    content: 'Hi Rajesh, I saw your cotton fabrics. Do you make customized shirt material?',
    isRead: true,
    createdAt: new Date('2023-08-16T09:30:00')
  },
  {
    id: 'm6',
    senderId: 'w2',
    receiverId: 'c1',
    content: 'Hello! Yes, we do offer customized shirt materials. What specifications are you looking for?',
    isRead: true,
    createdAt: new Date('2023-08-16T10:15:00')
  },
  {
    id: 'm7',
    senderId: 'c1',
    receiverId: 'w3',
    content: 'Hello Lakshmi, your jute wall hangings are beautiful. Do you ship internationally?',
    isRead: false,
    createdAt: new Date('2023-08-17T14:20:00')
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

// Default orders for demo
export const defaultOrders = [
  {
    id: 'o1',
    customerId: 'c1',
    weaverId: 'w1',
    productId: 'p1',
    quantity: 1,
    status: OrderStatus.DELIVERED,
    totalAmount: 12500,
    paymentMethod: 'Card',
    shippingAddress: '123 Main St, Bangalore, India',
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-07-20')
  },
  {
    id: 'o2',
    customerId: 'c1',
    weaverId: 'w2',
    productId: 'p2',
    quantity: 2,
    status: OrderStatus.PROCESSING,
    totalAmount: 3240, // After discount
    paymentMethod: 'UPI',
    shippingAddress: '123 Main St, Bangalore, India',
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-07')
  },
  {
    id: 'o3',
    customerId: 'c1',
    weaverId: 'w3',
    productId: 'p3',
    quantity: 1,
    status: OrderStatus.SHIPPED,
    totalAmount: 2200,
    paymentMethod: 'COD',
    shippingAddress: '123 Main St, Bangalore, India',
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-08-12')
  }
];

// Initialize default data in localStorage
export const initializeDefaultData = () => {
  // Check if data is already initialized
  if (!localStorage.getItem('dataInitialized')) {
    // Initialize messages
    localStorage.setItem('messages', JSON.stringify(defaultMessages));
    
    // Initialize orders
    localStorage.setItem('orders', JSON.stringify(defaultOrders));
    
    // Initialize products
    localStorage.setItem('products', JSON.stringify(products));
    
    // Initialize users (weavers and customers)
    const allUsers = [...weavers, ...customers];
    localStorage.setItem('users', JSON.stringify(allUsers));
    
    // Mark data as initialized
    localStorage.setItem('dataInitialized', 'true');
  }
};

// Helper function to handle new weaver registration
export const registerNewWeaver = (weaver: User) => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUsers = [...existingUsers, weaver];
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  return weaver;
};

// Helper function to add new product
export const addNewProduct = (product: Product) => {
  const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
  const updatedProducts = [...existingProducts, product];
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  return product;
};

// Helper function to get all products including newly added ones
export const getAllProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts) as Product[];
  }
  return products;
};

// Helper function to get all weavers including newly registered ones
export const getAllWeavers = () => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    const allUsers = JSON.parse(storedUsers) as User[];
    return allUsers.filter(user => user.role === UserRole.WEAVER);
  }
  return weavers;
};

// Helper function to get messages for a specific user
export const getMessagesForUser = (userId: string) => {
  const storedMessages = localStorage.getItem('messages');
  if (storedMessages) {
    const allMessages = JSON.parse(storedMessages) as Message[];
    return allMessages.filter(message => 
      message.senderId === userId || message.receiverId === userId
    );
  }
  return [] as Message[];
};

// Helper function to get orders for a specific user
export const getOrdersForUser = (userId: string, role: UserRole) => {
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    const allOrders = JSON.parse(storedOrders);
    if (role === UserRole.CUSTOMER) {
      return allOrders.filter(order => order.customerId === userId);
    } else if (role === UserRole.WEAVER) {
      return allOrders.filter(order => order.weaverId === userId);
    }
  }
  return [];
};
