import { ZhipuAI } from 'zhipuai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ZHIPUAI_API_KEY;
if (!apiKey) {
  console.error('ZHIPUAI_API_KEY is not set in the environment variables');
  process.exit(1);
}

const client = new ZhipuAI({ apiKey });

export async function analyzeWithAI(prompt) {
  try {
    console.log('Sending request to ZhipuAI');
    const response = await client.chat.completions.create({
      model: "glm-4-alltools",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        }
      ],
      stream: false,
      tools: [
        {
          "type": "web_browser",
          "web_browser": {
            "browser": "auto"
          }
        }
      ]
    });

    console.log('Received response from ZhipuAI');
    return {
      result: response.choices[0].message.content,
      tokenUsage: response.usage.total_tokens
    };
  } catch (error) {
    console.error('Error calling ZhipuAI:', error);
    throw new Error(`An error occurred while analyzing with AI: ${error.message}`);
  }
}