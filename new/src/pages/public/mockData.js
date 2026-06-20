// Mock data for Patient AI pages

export const mockMedicalAIResponse = {
  success: true,
  result: {
    type: "analysis",
    title: "Medical Image Analysis",
    summary: "Based on the uploaded image, our AI has identified the following:",
    findings: [
      "No immediate abnormalities detected in the visible area.",
      "Tissue density appears within normal ranges.",
      "Recommendation: Follow up with a healthcare provider for a comprehensive evaluation.",
    ],
    confidence: 0.87,
    disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice.",
  },
};

export const mockKnowledgeAIResponse = {
  success: true,
  results: [
    {
      title: "Understanding Hypertension",
      content: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high. It can lead to serious health issues if left untreated.",
      source: "Medical Knowledge Base",
    },
    {
      title: "Common Blood Pressure Medications",
      content: "There are several types of medications used to treat hypertension, including ACE inhibitors, beta-blockers, diuretics, and calcium channel blockers. Your doctor can help determine which is best for you.",
      source: "Pharmacy Database",
    },
  ],
};

export const mockDrugSearchResults = [
  {
    name: "Paracetamol",
    genericName: "Acetaminophen",
    manufacturer: "PharmaCorp",
    indications: "Pain relief, fever reduction",
    dosage: "500mg every 4-6 hours, max 4g/day",
    sideEffects: "Nausea, rash (rare)",
    contraindications: "Severe liver disease",
    price: 25,
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    manufacturer: "MediPharm",
    indications: "Bacterial infections (respiratory, urinary, skin)",
    dosage: "250-500mg every 8 hours for 7-10 days",
    sideEffects: "Diarrhea, nausea, rash",
    contraindications: "Penicillin allergy",
    price: 45,
  },
  {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    manufacturer: "HealthCare Ltd",
    indications: "Pain, inflammation, fever",
    dosage: "200-400mg every 4-6 hours, max 1.2g/day",
    sideEffects: "Stomach upset, heartburn",
    contraindications: "Active peptic ulcer, severe heart failure",
    price: 30,
  },
];
