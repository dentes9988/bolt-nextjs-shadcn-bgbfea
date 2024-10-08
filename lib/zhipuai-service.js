import { ZhipuAI } from 'zhipuai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ZHIPUAI_API_KEY;
if (!apiKey) {
  console.error('ZHIPUAI_API_KEY is not set in the environment variables');
  process.exit(1);
}

const client = new ZhipuAI({ apiKey });

export function formatPromptForJSON(prompt) {
  return `${prompt}\n\n请以JSON格式输出结果，确保输出是有效的JSON字符串。`;
}

export function parseAIResponse(response) {
  try {
    // 尝试直接解析整个响应
    return JSON.parse(response);
  } catch (error) {
    // 如果直接解析失败，尝试提取JSON部分
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error('无法解析提取的JSON:', innerError);
      }
    }
    console.error('无法解析AI响应为JSON:', error);
    return { error: '无法解析响应', rawResponse: response };
  }
}

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