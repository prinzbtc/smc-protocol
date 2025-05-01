import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateArticlePrompt = (userPrompt: string) => {
  return `
You're a financial analyst writing for an investment DAO.
Write a long-form article based on the following request:

"${userPrompt}"

Structure the article with:
- A clear intro
- Section headers
- Bullet points when relevant
- A conclusion with actionable takeaways
- Use markdown formatting

Keep a professional tone but stay engaging.
`;
};
