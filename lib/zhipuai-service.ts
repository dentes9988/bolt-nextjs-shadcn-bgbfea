import { ModelName } from './modelPricing';

// Mock implementation
const mockAIResponse = (prompt: string) => {
  return {
    choices: [{ message: { content: `Mock response for: ${prompt}` } }],
    usage: { total_tokens: Math.floor(Math.random() * 1000) + 1 }
  };
};

export async function analyzeWithAI(prompt: string, model: ModelName = 'GLM-4-AllTools'): Promise<{ result: string, tokenUsage: number }> {
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = mockAIResponse(prompt);

    return {
      result: response.choices[0].message.content,
      tokenUsage: response.usage.total_tokens
    };
  } catch (error) {
    console.error('Error calling mock ZhipuAI:', error);
    throw new Error("An error occurred while analyzing with AI.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `https://example.com/mock-image.jpg?prompt=${encodeURIComponent(prompt)}`;
  } catch (error) {
    console.error('Error generating mock image:', error);
    throw new Error("An error occurred while generating the image.");
  }
}