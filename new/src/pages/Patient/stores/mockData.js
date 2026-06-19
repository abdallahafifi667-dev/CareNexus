// Mock data for Patient pages

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockPatientOrders = (count = 8) => {
  const titles = [
    "Heart Checkup", "Pediatric Consultation", "Neurology Screening", "Emergency Care",
    "Routine Checkup", "Follow-up Visit", "Blood Test Analysis", "X-Ray Review",
  ];
  const statuses = ["open", "confirmed", "in_progress", "completed", "completed", "cancelled"];
  const doctors = [
    { username: "Dr. Ahmed Hassan", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Ahmed&backgroundColor=0088ff" },
    { username: "Dr. Sara Mahmoud", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Sara&backgroundColor=0088ff" },
    { username: "Dr. Omar Farouk", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Omar&backgroundColor=0088ff" },
    { username: "Dr. Fatma El-Sayed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Fatma&backgroundColor=0088ff" },
  ];

  const orders = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const status = statuses[i % statuses.length];
    
    orders.push({
      _id: `order_${i}_${Date.now()}`,
      title: titles[i % titles.length],
      description: "Patient requires comprehensive evaluation including tests and consultation.",
      status: status,
      price: 100 + Math.floor(Math.random() * 900),
      urgencyLevel: ["normal", "urgent", "emergency"][i % 3],
      appointmentDate: date.toISOString(),
      createdAt: date.toISOString(),
      medicalServiceType: i % 2 === 0 ? "doctor" : "nursing",
      provider: status !== "open" ? doctors[i % doctors.length] : null,
      meetingLat: 30.0444 + (Math.random() - 0.5) * 0.05,
      meetingLng: 31.2357 + (Math.random() - 0.5) * 0.05,
    });
  }
  return orders;
};

const generateMockConversations = (count = 5) => {
  const names = ["Dr. Ahmed Hassan", "Dr. Sara Mahmoud", "Dr. Omar Farouk", "Dr. Fatma El-Sayed", "Dr. Khaled Nasser"];
  const lastMessages = [
    "Hello, how are you feeling today?",
    "Your test results are ready.",
    "Please take the medication as prescribed.",
    "See you at the next appointment.",
    "Is there anything else I can help with?",
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    return {
      _id: `conv_${i}_${Date.now()}`,
      partner: {
        _id: `doctor_${i}`,
        username: names[i % names.length],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names[i % names.length])}&backgroundColor=0088ff`,
      },
      lastMessage: lastMessages[i % lastMessages.length],
      lastMessageAt: date.toISOString(),
      unreadCount: Math.floor(Math.random() * 3),
    };
  });
};

export const mockFetchPatientOrders = async () => {
  await delay(500);
  return generateMockPatientOrders(8);
};

export const mockFetchConversations = async () => {
  await delay(300);
  return generateMockConversations(5);
};

export const mockCreateOrder = async (orderData) => {
  await delay(800);
  return {
    _id: `order_new_${Date.now()}`,
    ...orderData,
    status: "open",
    createdAt: new Date().toISOString(),
  };
};
