// Mock data for Pharmacy pages

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockOrders = (count = 8) => {
  const statuses = ["preparing", "ready", "shipped", "delivered", "delivered", "cancelled"];
  const patients = [
    { username: "Khaled Mostafa", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Khaled&backgroundColor=0088ff" },
    { username: "Nour El-Hassan", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Nour&backgroundColor=0088ff" },
    { username: "Layla Ahmed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Layla&backgroundColor=0088ff" },
    { username: "Yousef Samir", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Yousef&backgroundColor=0088ff" },
  ];
  const products = ["Paracetamol 500mg", "Amoxicillin 250mg", "Vitamin C 1000mg", "Blood Pressure Monitor", "First Aid Kit", "Ibuprofen 400mg"];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return {
      _id: `order_${i}_${Date.now()}`,
      orderNumber: `ORD-${1000 + i}`,
      status: statuses[i % statuses.length],
      totalAmount: 50 + Math.floor(Math.random() * 500),
      createdAt: date.toISOString(),
      patient: patients[i % patients.length],
      items: [
        { product: { name: products[i % products.length] }, quantity: Math.floor(Math.random() * 3) + 1, price: 20 + Math.floor(Math.random() * 100) },
      ],
    };
  });
};

const generateMockProducts = (count = 6) => {
  const names = ["Paracetamol 500mg", "Amoxicillin 250mg", "Vitamin C 1000mg", "Blood Pressure Monitor", "First Aid Kit", "Ibuprofen 400mg"];
  const categories = ["Medications", "Supplements", "Devices", "First Aid", "Personal Care"];

  return Array.from({ length: count }, (_, i) => ({
    _id: `prod_${i}_${Date.now()}`,
    name: names[i % names.length],
    description: `High quality ${names[i % names.length].toLowerCase()} for medical use.`,
    price: 20 + Math.floor(Math.random() * 200),
    quantity: 50 + Math.floor(Math.random() * 500),
    category: categories[i % categories.length],
    images: [`https://picsum.photos/seed/pharm${i + 1}/400/400`],
    avgRating: 3.5 + Math.random() * 1.5,
    totalRatings: Math.floor(Math.random() * 50),
  }));
};

const generateMockConversations = (count = 5) => {
  const names = ["FastShip Express", "CareDelivery Co.", "SwiftLogistics", "Helmy Pharmacy", "Shorouk Pharmacy"];
  const lastMessages = [
    "Hi, we'd like to discuss a partnership opportunity.",
    "Sure, what are your delivery capabilities?",
    "We can handle same-day delivery across Cairo.",
    "Great! Let's schedule a call to discuss the terms.",
    "I'll send the contract details by email.",
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    return {
      _id: `conv_${i}_${Date.now()}`,
      partner: {
        _id: `partner_${i}`,
        username: names[i % names.length],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names[i % names.length])}&backgroundColor=0088ff`,
      },
      lastMessage: lastMessages[i % lastMessages.length],
      lastMessageAt: date.toISOString(),
      unreadCount: Math.floor(Math.random() * 3),
    };
  });
};

export const mockFetchPharmacyOrders = async () => {
  await delay(500);
  return generateMockOrders(8);
};

export const mockFetchPharmacyProducts = async () => {
  await delay(400);
  return generateMockProducts(6);
};

export const mockFetchPharmacyConversations = async () => {
  await delay(300);
  return generateMockConversations(5);
};

export const mockFetchPharmacyDashboard = async () => {
  await delay(300);
  return {
    totalOrders: 45,
    pendingOrders: 8,
    totalRevenue: 12500,
    lowStockItems: 3,
    totalProducts: 120,
    activeContracts: 4,
  };
};
