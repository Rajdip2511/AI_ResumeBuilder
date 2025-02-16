import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const generateResume = async (userData) => {
  try {
    console.log('Generating resume for:', userData);
    const prompt = `Create a professional resume for the following person:

Full Name: ${userData.name}

Skills:
${userData.skills}

Work Experience:
${userData.experience}

Education:
${userData.education}

Achievements:
${userData.achievements}

Please format the resume in a clear, professional structure with sections for Summary, Skills, Work Experience, Education, and Achievements. Use bullet points where appropriate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer who creates clear, concise, and effective resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('API Response:', completion);

    if (completion.choices && completion.choices[0]) {
      return completion.choices[0].message.content;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error details:', error);
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.status === 402) {
      throw new Error('API quota exceeded. Please check your OpenAI account.');
    } else {
      throw new Error(error.message || 'Failed to generate resume. Please try again.');
    }
  }
};

export default openai; 