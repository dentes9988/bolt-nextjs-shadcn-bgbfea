import express from 'express';
import cors from 'cors';
import { analyzeWithAI, formatPromptForJSON, parseAIResponse } from './lib/zhipuai-service.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { userGroup, requirementDescription } = req.body;
    
    const prompt = formatPromptForJSON(`
      基于以下信息：
      目标用户群体：${userGroup}
      产品需求描述：${requirementDescription}

      请分析并描述以下三类用户，并为每类用户提供详细画像：

      1. 轻度体验者：什么样的人会来体验这个功能？
      2. 普通使用者：什么样的人会经常使用这个功能？
      3. 重度使用者：什么样的人必须每天都使用这个功能？

      对每种类型的用户，请提供以下信息：
      - 简短描述
      - 年龄层
      - 收入来源
      - 收入范围
      - 个性化偏好（列出3-5个）
      - 常用APP（列出3-5个）
      - 需求动机
      - 使用前场景：描述该用户在使用产品前的具体情况
      - 使用后场景：描述该用户使用产品后的变化和收益

      请确保信息具体且符合实际。请以JSON格式输出结果，便于解析。
    `);

    const response = await analyzeWithAI(prompt);
    const parsedResponse = parseAIResponse(response.result);

    res.json({ 
      rawResponse: response.result,
      parsedResponse: parsedResponse
    });
  } catch (error) {
    console.error('分析失败:', error);
    res.status(500).json({ error: '分析过程中发生错误', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));