export const modelPricing = {
  'GLM-4-AllTools': {
    contextWindow: 128000,
    pricePerThousandTokens: 0.30,
    batchApiPricePerThousandTokens: 0.15
  },
  // 可以在这里添加其他模型的定价
};

export type ModelName = keyof typeof modelPricing;

export function calculateCost(model: ModelName, tokenUsage: number, isBatchApi: boolean = false): number {
  const pricing = modelPricing[model];
  if (!pricing) {
    throw new Error(`Unknown model: ${model}`);
  }

  const pricePerToken = isBatchApi && pricing.batchApiPricePerThousandTokens !== null
    ? pricing.batchApiPricePerThousandTokens / 1000
    : pricing.pricePerThousandTokens / 1000;

  return tokenUsage * pricePerToken;
}