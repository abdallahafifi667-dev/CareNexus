// Mock data for Doctor pages - uses seed data
// This simulates API responses until backend routes are ready

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock orders for a doctor
const generateMockOrders = (doctorId, status, count = 5) => {
  const titles = [
    "Heart Checkup", "Pediatric Consultation", "Neurology Screening", "Emergency Care",
    "Routine Checkup", "Follow-up Visit", "Blood Test Analysis", "X-Ray Review",
    "Physical Therapy", "Vaccination", "Health Screening", "Dermatology Consultation",
    "Orthopedic Assessment", "Gynecology Checkup", "Psychiatric Evaluation", "Wound Dressing",
  ];
  const descriptions = [
    "Patient requires comprehensive evaluation including tests and consultation.",
    "Routine assessment and follow-up to monitor ongoing condition.",
    "Urgent medical attention needed for acute symptoms.",
    "Scheduled appointment for preventive care and health maintenance.",
  ];
  const patients = [
    { username: "Khaled Mostafa", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Khaled+Mostafa&backgroundColor=0088ff" },
    { username: "Nour El-Hassan", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Nour+El-Hassan&backgroundColor=0088ff" },
    { username: "Layla Ahmed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Layla+Ahmed&backgroundColor=0088ff" },
    { username: "Yousef Samir", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Yousef+Samir&backgroundColor=0088ff" },
    { username: "Mona Abdel-Rahman", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mona+Abdel-Rahman&backgroundColor=0088ff" },
    { username: "Omar Tarek", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Omar+Tarek&backgroundColor=0088ff" },
    { username: "Sara Ibrahim", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sara+Ibrahim&backgroundColor=0088ff" },
    { username: "Ali Hassan", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ali+Hassan&backgroundColor=0088ff" },
    { username: "Hana Mohamed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Hana+Mohamed&backgroundColor=0088ff" },
    { username: "Tarek Nabil", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tarek+Nabil&backgroundColor=0088ff" },
    { username: "Dina Adel", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dina+Adel&backgroundColor=0088ff" },
    { username: "Amr Saeed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Amr+Saeed&backgroundColor=0088ff" },
  ];

  const orders = [];
  for (let i = 0; i < count; i++) {
    const patient = patients[i % patients.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    orders.push({
      _id: `order_${status}_${i}_${Date.now()}`,
      title: titles[i % titles.length],
      description: descriptions[i % descriptions.length],
      status: status,
      price: 100 + Math.floor(Math.random() * 900),
      commission: 10 + Math.floor(Math.random() * 50),
      urgencyLevel: ["normal", "urgent", "emergency"][i % 3],
      appointmentDate: date.toISOString(),
      createdAt: date.toISOString(),
      patientId: `patient_${i}`,
      providerId: status !== "open" ? doctorId : null,
      patient: patient,
      meetingLat: 30.0444 + (Math.random() - 0.5) * 0.05,
      meetingLng: 31.2357 + (Math.random() - 0.5) * 0.05,
    });
  }
  return orders;
};

// Generate mock conversations
const generateMockConversations = (count = 6) => {
  const names = ["Khaled Mostafa", "Nour El-Hassan", "Layla Ahmed", "Yousef Samir", "Mona Abdel-Rahman", "Omar Tarek"];
  const lastMessages = [
    "Hello doctor, I have a question about my prescription.",
    "Thank you doctor, I'm feeling much better now.",
    "When should I take the medication?",
    "Can we schedule a follow-up visit?",
    "I've been experiencing some side effects.",
    "The treatment is working well, thank you!",
  ];

  const conversations = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    
    conversations.push({
      _id: `conv_${i}_${Date.now()}`,
      partner: {
        _id: `patient_${i}`,
        username: names[i % names.length],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names[i % names.length])}&backgroundColor=0088ff`,
      },
      lastMessage: lastMessages[i % lastMessages.length],
      lastMessageAt: date.toISOString(),
      unreadCount: Math.floor(Math.random() * 3),
    });
  }
  return conversations;
};

// Mock API functions
export const mockFetchAvailableOrders = async () => {
  await delay(500);
  return generateMockOrders("doctor_1", "open", 8);
};

export const mockFetchActiveOrders = async (userId) => {
  await delay(500);
  const confirmed = generateMockOrders(userId, "confirmed", 4);
  const inProgress = generateMockOrders(userId, "in_progress", 3);
  return [...confirmed, ...inProgress].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const mockFetchHistoryOrders = async (userId) => {
  await delay(500);
  const completed = generateMockOrders(userId, "completed", 6);
  const cancelled = generateMockOrders(userId, "cancelled", 2);
  return [...completed, ...cancelled].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const mockFetchConversations = async () => {
  await delay(300);
  return generateMockConversations(6);
};

export const mockFetchDoctorReviews = async () => {
  await delay(400);
  return [
    { _id: "rev_1", rating: 5, comment: "Excellent service, very professional!", userId: "patient_1", targetId: "doctor_1", targetType: "user", createdAt: new Date().toISOString(), user: { username: "Khaled Mostafa", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Khaled&backgroundColor=0088ff" } },
    { _id: "rev_2", rating: 4, comment: "Great doctor, highly recommended.", userId: "patient_2", targetId: "doctor_1", targetType: "user", createdAt: new Date().toISOString(), user: { username: "Nour El-Hassan", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Nour&backgroundColor=0088ff" } },
    { _id: "rev_3", rating: 5, comment: "Very caring and attentive.", userId: "patient_3", targetId: "doctor_1", targetType: "user", createdAt: new Date().toISOString(), user: { username: "Layla Ahmed", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Layla&backgroundColor=0088ff" } },
    { _id: "rev_4", rating: 4, comment: "Explained everything clearly.", userId: "patient_4", targetId: "doctor_1", targetType: "user", createdAt: new Date().toISOString(), user: { username: "Yousef Samir", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Yousef&backgroundColor=0088ff" } },
    { _id: "rev_5", rating: 5, comment: "Quick and efficient service.", userId: "patient_5", targetId: "doctor_1", targetType: "user", createdAt: new Date().toISOString(), user: { username: "Mona Abdel-Rahman", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mona&backgroundColor=0088ff" } },
  ];
};

export const mockFetchDoctorDashboard = async () => {
  await delay(300);
  return {
    activeOrders: 7,
    completedOrders: 23,
    totalEarnings: 15400,
    averageRating: 4.6,
    totalReviews: 18,
    pendingOffers: 3,
  };
};

export const mockFetchNotifications = async () => {
  await delay(200);
  return [
    { _id: "notif_1", type: "order", title: "New Order Request", message: "Khaled Mostafa requested a heart checkup.", isRead: false, createdAt: new Date().toISOString() },
    { _id: "notif_2", type: "order", title: "Order Completed", message: "Your session with Layla Ahmed has been completed.", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: "notif_3", type: "review", title: "New Review", message: "Yousef Samir left a 5-star review.", isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { _id: "notif_4", type: "system", title: "Welcome!", message: "Welcome to CareNexus platform.", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ];
};
