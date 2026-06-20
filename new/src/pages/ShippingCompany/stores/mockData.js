// Mock data for Shipping Company pages

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockDeliveries = (count = 10) => {
  const statuses = ["active", "active", "completed", "completed", "pending"];
  const addresses = [
    "Nasr City, Cairo", "Maadi, Cairo", "Zamalek, Cairo", "Heliopolis, Cairo",
    "Mohandessin, Giza", "6th October City", "New Cairo", "Sheraton, Cairo",
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));
    return {
      _id: `delivery_${i}_${Date.now()}`,
      orderNumber: `DEL-${2000 + i}`,
      status: statuses[i % statuses.length],
      pickupAddress: "Helmy Pharmacy, Downtown Cairo",
      deliveryAddress: addresses[i % addresses.length],
      customerName: ["Khaled Mostafa", "Nour El-Hassan", "Layla Ahmed", "Yousef Samir", "Mona Abdel-Rahman"][i % 5],
      customerPhone: `+2010${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: date.toISOString(),
      estimatedDelivery: new Date(Date.now() + Math.random() * 86400000).toISOString(),
    };
  });
};

const generateMockContracts = (count = 4) => {
  const pharmacies = ["Helmy Pharmacy", "Shorouk Pharmacy", "Nile Pharmacy", "Delta Pharmacy"];
  const statuses = ["accepted", "accepted", "pending", "accepted"];

  return Array.from({ length: count }, (_, i) => ({
    _id: `contract_${i}_${Date.now()}`,
    pharmacyName: pharmacies[i % pharmacies.length],
    pharmacyId: `pharmacy_${i}`,
    shippingCompanyId: `shipping_${i}`,
    status: statuses[i % statuses.length],
    discountRate: 5 + Math.floor(Math.random() * 10),
    maxDeliveryTime: "48 hours",
    coverageArea: "Cairo & Giza",
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));
};

export const mockFetchShippingDeliveries = async () => {
  await delay(500);
  return generateMockDeliveries(10);
};

export const mockFetchShippingContracts = async () => {
  await delay(400);
  return generateMockContracts(4);
};

export const mockFetchShippingDashboard = async () => {
  await delay(300);
  return {
    activeDeliveries: 12,
    completedDeliveries: 45,
    totalContracts: 4,
    totalEarnings: 8750,
    onTimeRate: 94,
  };
};
