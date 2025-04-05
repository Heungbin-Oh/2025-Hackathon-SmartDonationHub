const { GoogleGenAI, createUserContent, createPartFromUri,createPartFromBase64, HarmBlockThreshold, HarmCategory} = require("@google/genai");
require('dotenv').config(); 

const genAI = new GoogleGenAI({ apiKey: process.env.AI_GEMI});
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
  ];
  const CATEGORIES = ["Canned Goods","Non-Perishable", "Clothes"];

async function getDonationCategoryAI(donationText, donationImage) {
  try {
    const contentParts = [
      createUserContent(`You are an assistant that categorizes donation items. Given the donation description: "${donationText || "No description provided"}".
        From the following list of categories: ${CATEGORIES.join(", ")},
        determine the best matching category for this donation.

        Return your answer in **strict JSON** format with no additional text:
        - If a valid category is found, output exactly: {"category": ["Category Name"]}.
        - If no appropriate category is found, output: {"status": "NoCategory"}.
        - If the donation contains inappropriate content or trolling, output: {"status": "TrollDetected"}.`),
    ];

    if (donationImage) {
        const base64Image = donationImage.buffer.toString("base64");
        contentParts.push(createPartFromBase64(base64Image, donationImage.mimetype));
      }
  
      // Enviar la solicitud a Gemini
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        safetySettings,
        contents: contentParts,
      });

      return JSON.parse(response.candidates[0].content.parts[0].text);
  } catch (error) {
    throw new Error("Error with AI request");
  }
}

module.exports = getDonationCategoryAI;