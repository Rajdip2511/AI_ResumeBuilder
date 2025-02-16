import axios from 'axios';

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Create axios instance with custom config
const mistralClient = axios.create({
  baseURL: MISTRAL_API_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// Retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateResume(userData) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log('Generating resume with Mistral AI for:', userData);
      
      const formattedPrompt = `Create a professional resume with the following information. Format it exactly as shown below, without any special characters, symbols, or tags:

${userData.name}

${userData.name.toLowerCase().replace(/\s/g, '')}@email.com | linkedin.com/in/${userData.name.toLowerCase().replace(/\s/g, '-')} | San Francisco, CA | (123) 456-7890

SUMMARY
${userData.skills.split(',')[0]} professional with expertise in ${userData.skills}. Proven track record of delivering high-impact solutions and driving technical innovation. ${userData.experience.split('.')[0]}.

EXPERIENCE
${userData.experience.split('\n').map(exp => `- ${exp}`).join('\n')}

EDUCATION
${userData.education}

TECHNICAL SKILLS
${userData.skills.split(',').map(skill => `- ${skill.trim()}`).join('\n')}

${userData.achievements ? `ACHIEVEMENTS\n${userData.achievements.split('\n').map(achievement => `- ${achievement}`).join('\n')}` : ''}

Please ensure:
1. Use UPPERCASE for section headers (SUMMARY, EXPERIENCE, etc.)
2. Use simple bullet points with a hyphen (-)
3. No special characters or formatting symbols
4. Clean, professional spacing between sections
5. No HTML tags or special formatting`;

      const response = await mistralClient.post('', {
        model: "mistral-medium",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Create clean, minimal resumes with clear sections and simple bullet points. Use plain text only - no special formatting, no HTML, no markdown, no symbols except simple hyphens for bullet points. Maintain consistent spacing between sections."
          },
          {
            role: "user",
            content: formattedPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      console.log('Mistral API Response:', response.data);

      if (response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content
          .replace(/[*+#~]/g, '') // Remove special characters
          .replace(/<[^>]*>/g, '') // Remove any HTML tags
          .replace(/\n{3,}/g, '\n\n') // Normalize spacing between sections
          .replace(/^[-•]\s*/gm, '- ') // Standardize bullet points
          .replace(/\b[A-Z]+\b/g, match => match) // Keep section headers uppercase
          .trim();

        return content;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid API key. Please check your Mistral API key configuration.');
          case 429:
            await sleep(RETRY_DELAY * 2);
            break;
          case 500:
            throw new Error('Mistral service error. Please try again later.');
          default:
            if (retries === MAX_RETRIES - 1) {
              throw new Error(`Failed to generate resume: ${error.response.data.error?.message || 'Unknown error'}`);
            }
        }
      } else if (error.code === 'ECONNABORTED') {
        if (retries === MAX_RETRIES - 1) {
          throw new Error('Request timed out after multiple attempts. Please try again.');
        }
      } else {
        if (retries === MAX_RETRIES - 1) {
          throw new Error('Failed to generate resume. Please try again later.');
        }
      }

      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
        await sleep(RETRY_DELAY);
      }
    }
  }
} 