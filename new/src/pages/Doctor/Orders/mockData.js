export const getMockAvailableOrders = (lang = 'en') => {
    return [
        {
            _id: "mock-avail-1",
            title: lang === 'ar' ? "استشارة عامة - صداع والدوخة" : "General Consultation - Headache and Dizziness",
            description: lang === 'ar' ? "استشارة بخصوص آلام في الرأس والدوخة المستمرة" : "Consultation regarding persistent head pain and dizziness",
            medicalServiceType: "doctor",
            price: 150,
            urgencyLevel: "high",
            status: "open",
            patientName: lang === 'ar' ? "أحمد الشريف" : "Ahmed El-Sherif",
            patientAge: 35,
            patientGender: "male",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "mock-avail-2",
            title: lang === 'ar' ? "استشارة متخصصة - جلدية" : "Specialized Consultation - Dermatology",
            description: lang === 'ar' ? "الحاجة لاستشارة تخصصية في الجلدية" : "Need for a specialized dermatology consultation",
            medicalServiceType: "doctor",
            price: 200,
            urgencyLevel: "medium",
            status: "open",
            patientName: lang === 'ar' ? "فاطمة محمد" : "Fatima Mohamed",
            patientAge: 28,
            patientGender: "female",
            createdAt: new Date().toISOString(),
        }
    ];
};

export const getMockActiveOrders = (lang = 'en') => {
    return [
        {
            _id: "mock-active-1",
            title: lang === 'ar' ? "استشارة عامة - آلام الظهر" : "General Consultation - Back Pain",
            description: lang === 'ar' ? "استشارة عن الآلام في الظهر والعمود الفقري" : "Consultation regarding back and spinal pain",
            medicalServiceType: "doctor",
            price: 180,
            urgencyLevel: "medium",
            status: "accepted",
            patientName: lang === 'ar' ? "علي أحمد" : "Ali Ahmed",
            patientAge: 50,
            patientGender: "male",
            createdAt: new Date().toISOString(),
        }
    ];
};

export const getMockHistoryOrders = (lang = 'en') => {
    return [
        {
            _id: "mock-hist-1",
            title: lang === 'ar' ? "استشارة عامة - الحساسية والربو" : "General Consultation - Allergy and Asthma",
            description: lang === 'ar' ? "استشارة عن الحساسية والربو" : "Consultation regarding allergy and asthma",
            medicalServiceType: "doctor",
            price: 150,
            urgencyLevel: "medium",
            status: "completed",
            patientName: lang === 'ar' ? "نور محمود" : "Nour Mahmoud",
            patientAge: 29,
            patientGender: "female",
            rating: 5,
            review: lang === 'ar' ? "الدكتور متميز جداً وشرح لي كل شيء بوضوح" : "The doctor is very excellent and explained everything clearly",
            createdAt: new Date().toISOString(),
        }
    ];
};
