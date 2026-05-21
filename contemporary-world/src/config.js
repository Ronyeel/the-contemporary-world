// Configuration for external APIs and app settings
export const config = {
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
    model: "llama-3.3-70b-versatile",
    endpoint: "https://api.groq.com/openai/v1/chat/completions"
  }
};
