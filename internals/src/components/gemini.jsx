import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
// Log the key

const GetResponse = async (inputValue) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      inputValue +
        "summarize the content in a fewlines , use \n to make it formatted"
    );
    const response = result.response;
    const text = await response.text(); // `await` here to ensure we resolve the promise
    return text; // return the response text
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; // Re-throw the error after logging
  }
};

export default GetResponse;
