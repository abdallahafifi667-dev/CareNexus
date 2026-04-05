const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiAPI {
  static async sendMessage(message, imageContext = null) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("Gemini API key not found");
        return "Your medical question has been received. I will assist using available medical information.";
      }

      const prompt = `
You are a medical AI assistant with context awareness.

**ABOUT YOU:**
- You are "CareNexus AI" - an advanced medical AI assistant
- You are one of the innovative projects developed by **SilTech **
- SilTech is a leading technology company specializing in healthcare AI solutions and medical technology
- Your mission is to provide accurate, reliable, and professional medical information to help patients understand their health better
- You were created to bridge the gap between complex medical information and patient understanding
- You serve both individual patients and large healthcare institutions

**WHEN ASKED ABOUT WHO CREATED YOU:**
Respond with pride that you are one of the projects of SilTech , a pioneering technology company in the field of medical AI and healthcare solutions. Mention that SilTech is committed to developing innovative tools that empower patients with knowledge while maintaining the highest standards of medical accuracy and professionalism.

${
  imageContext && imageContext.hasContext
    ? `
IMPORTANT CONTEXT: The user previously uploaded a medical image that was analyzed as:
---
${imageContext.analysis}
---
Timestamp: ${imageContext.timestamp}

If the current question is related to this image/analysis, use this context to answer.
If the question is unrelated to the image, answer it independently as a separate medical query.
`
    : ""
}

User query: ${message}

Provide a short, clear, medically accurate answer.

If the query involves medicine, symptoms, treatment, or medical advice, include:
1. Identification.
2. Purpose.
3. Usage and dosage (if applicable).
4. Risks and side effects.
5. Precautions.
6. What to do in case of overdose, misuse, or danger.

Keep the response concise and medically reliable.
Respond in the same language used by the user.
Respond in Arabic. Be helpful and informative
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1024,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error("API request failed");
      }

      const data = await response.json();

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I have processed your medical question and provided the best possible guidance."
      );
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An error occurred while processing your request. Please try again.";
    }
  }

  static async analyzeImage(imageFile) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("Gemini API key not found");
        return {
          analysis:
            "Image received, but no API key is available for medical analysis.",
          metadata: {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const base64Image = await this.fileToBase64(imageFile);
      const base64Data = base64Image.split(",")[1];

      // المرحلة الأولى: تحديد نوع الصورة الطبية
      const detectionPrompt = `
Analyze this medical image and determine its type. Respond with ONLY ONE of these exact categories:
- MEDICATION (if it's a medicine box, pill, capsule, drug packaging, prescription drug, or pharmaceutical product)
- MEDICAL_SCAN (if it's an X-ray, CT scan, MRI, ultrasound, radiograph, or any diagnostic imaging)
- LAB_TEST (if it's a laboratory test result, blood test, urine test, or medical lab report)
- ECG (if it's an electrocardiogram, heart rhythm strip, or cardiac monitoring)
- EEG (if it's an electroencephalogram or brain wave recording)
- OTHER_MEDICAL (for any other medical-related content)

Respond with ONLY the category name, nothing else.
`;

      const detectionResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: detectionPrompt },
                  {
                    inline_data: {
                      mime_type: imageFile.type,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 50,
            },
          }),
        },
      );

      const detectionData = await detectionResponse.json();
      const imageType =
        detectionData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "OTHER_MEDICAL";

      // المرحلة الثانية: تحليل الصورة بناءً على نوعها
      let analysisPrompt;

      if (imageType.includes("MEDICATION")) {
        analysisPrompt = `
You are a professional medical AI assistant specialized in pharmaceutical analysis.

Analyze the provided medication image and provide a comprehensive, medically accurate summary including:

📋 **1. Identification (التعريف)**
   - Name of the medication (commercial and scientific names)
   - Active ingredients
   - Pharmaceutical form (tablet, capsule, syrup, etc.)
   - Manufacturer

💊 **2. Medical Purpose (الغرض الطبي)**
   - What conditions/diseases it treats
   - Therapeutic category

📏 **3. Usage and Dosage (الاستخدام والجرعة)**
   - Recommended dosage for adults and children (if applicable)
   - How to take it (with/without food, timing)
   - Duration of treatment

⚠️ **4. Risks and Side Effects (المخاطر والآثار الجانبية)**
   - Common side effects
   - Serious side effects that require medical attention
   - Who should not use this medication (contraindications)

🛡️ **5. Safety Precautions (احتياطات السلامة)**
   - Drug interactions
   - Precautions for pregnant/breastfeeding women
   - Storage instructions

🚨 **6. Emergency Measures (إجراءات الطوارئ)**
   - What to do in case of overdose
   - What to do if a dose is missed
   - When to seek immediate medical help

**IMPORTANT**: Present the information in a clear, professional, well-structured format suitable for healthcare institutions and large medical organizations. Use Arabic language. Be comprehensive yet concise.
`;
      } else {
        analysisPrompt = `
أنت مساعد طبي متخصص في قراءة وشرح نتائج الفحوصات الطبية والأشعات بطريقة واضحة ومطمئنة.

**دورك**: مساعدة المريض على فهم نتيجة الفحص الذي قام بإجرائه، وتوجيهه للخطوات التالية.

حلل الصورة الطبية المرفقة (أشعة، تحليل، رسم قلب، أو أي فحص تشخيصي) وقدم تقرير واضح وموجز يساعد المريض:

🔍 **1. فهم نتيجة الفحص**
   - ما نوع الفحص الذي أجريته
   - ما الذي يظهر في نتيجتك بشكل واضح وبسيط
   - هل النتيجة طبيعية أم تحتاج متابعة

💡 **2. شرح الحالة بوضوح**
   - إذا كان هناك أي مشكلة صحية ظاهرة، ما هي؟
   - ما درجة الحالة (بسيطة، متوسطة، تحتاج رعاية)
   - كيف تؤثر هذه الحالة على حياتك اليومية

⚕️ **3. الخطوات التالية والتوجيهات**
   - ما الذي يجب أن تفعله الآن
   - متى يجب عليك زيارة الطبيب المختص
   - هل تحتاج فحوصات إضافية أو متابعة
   - نصائح عملية للعناية بصحتك

⚠️ **4. علامات التحذير المهمة**
   - أعراض تتطلب التوجه الفوري للطوارئ
   - حالات تستدعي استشارة عاجلة
   - ما يجب تجنبه حفاظاً على صحتك

📋 **5. معلومات مفيدة عن حالتك**
   - احتمالات التعافي والتحسن
   - عوامل قد تؤثر على الحالة
   - أمراض مزمنة محتملة إن لم يتم العلاج المناسب

**
ممكن تقولها عادي ملاحظات مهمة:**
- لن أصف لك أدوية محددة أو جرعات -
- لن أوصي بعمليات جراحية أو إجراءات محددة
- هدفي مساعدتك على فهم وضعك الصحي واتخاذ القرارات الصحيحة

**أسلوب الرد:**
- استخدم لغة عربية واضحة ومفهومة للمريض
- كن مطمئناً وداعماً في الأسلوب
- اشرح المصطلحات الطبية بطريقة بسيطة
- اجعل الرد موجز وواضح (لا يتجاوز 300 كلمة)

هدفك: مساعدة المريض على فهم وضعه الصحي والشعور بالطمأنينة، مع توجيهه للخطوات الصحيحة.
ولا تضع اي مقدمه او اي شي ليس له فائده
و اجعل الوضع مناسب لي التقارير المثاليه
و مش لازم تقولي اي هي الصوره علشان المستخدم اكيد عارف اي هي الصوره ولكن هوا عاوز يعرف استخدمها او خطورتها او اي تفاصيل فيها
و كمان مش عاوز اي خاتمه لي الكلام
و خلي في الاخر كلمه يجب ان تذهب الي الطبيب  او اي حاجه بس بي اسلوب جميل 
`;
      }

      // إرسال الطلب النهائي للتحليل
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: analysisPrompt },
                  {
                    inline_data: {
                      mime_type: imageFile.type,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 10000,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Image Analysis API Error:", errorData);
        throw new Error("Image analysis failed");
      }

      const data = await response.json();

      const analysisText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "تم تحليل الصورة الطبية بنجاح. إليك ملخص موجز.";

      return {
        analysis: analysisText,
        imageType: imageType,
        metadata: {
          fileName: imageFile.name,
          fileSize: imageFile.size,
          fileType: imageFile.type,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return {
        analysis: "حدث خطأ أثناء تحليل الصورة الطبية. يرجى المحاولة مرة أخرى.",
        metadata: {
          fileName: imageFile?.name,
          fileSize: imageFile?.size,
          fileType: imageFile?.type,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }
}
