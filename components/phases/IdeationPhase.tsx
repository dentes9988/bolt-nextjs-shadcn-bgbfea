"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'
import { modelPricing, ModelName } from '@/lib/modelPricing'
import { analyzeWithAI } from '@/lib/zhipuai-service'

export function IdeationPhase() {
  const [targetAudience, setTargetAudience] = useState('')
  const [problemToSolve, setProblemToSolve] = useState('')
  const [validationResult, setValidationResult] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [selectedModel, setSelectedModel] = useState<ModelName>('GLM-4-AllTools')
  const [lastAnalysisCost, setLastAnalysisCost] = useState<number | null>(null)
  const [lastTokenUsage, setLastTokenUsage] = useState<number | null>(null)
  const { language } = useLanguage();
  const t = translations[language];

  const handleValidate = async () => {
    setIsAnalyzing(true);
    setError('');
    try {
      const prompt = `
        目标用户群体：${targetAudience}
        想要提供的服务：${problemToSolve}
        
        请进行以下分析：
        1. 这个用户群体目前是否对提出的问题有所了解和关注？
        2. 这个创意解决的问题是否是这个群体的独特问题？
        3. 如果不是独特问题，请解释原因。
        4. 总体来说，这个创意是否通过验证？为什么？

        请使用搜索工具查找相关信息，并基于查找到的信息进行分析。回答时请提供详细的解释和理由。
      `;

      const response = await analyzeWithAI(prompt, selectedModel);

      setValidationResult(response.result);
      setLastAnalysisCost(calculateCost(selectedModel, response.tokenUsage));
      setLastTokenUsage(response.tokenUsage);
    } catch (error) {
      console.error('创意验证过程中出错:', error);
      setError(error.message || '创意验证过程中发生错误');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.ideationPhase}</CardTitle>
        <CardDescription>{t.validateIdea}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
              {t.targetAudience}
            </label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder={t.describeTargetAudience}
            />
          </div>
          
          <div>
            <label htmlFor="problemToSolve" className="block text-sm font-medium text-gray-700 mb-1">
              {t.problemToSolve}
            </label>
            <Textarea
              id="problemToSolve"
              value={problemToSolve}
              onChange={(e) => setProblemToSolve(e.target.value)}
              placeholder={t.describeProblem}
            />
          </div>
          
          <div>
            <label htmlFor="modelSelect" className="block text-sm font-medium text-gray-700 mb-1">
              {t.selectModel}
            </label>
            <Select value={selectedModel} onValueChange={(value: ModelName) => setSelectedModel(value)}>
              <SelectTrigger id="modelSelect">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(modelPricing).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleValidate} disabled={isAnalyzing || !targetAudience || !problemToSolve}>
            {isAnalyzing ? t.analyzing : t.validate}
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          {lastAnalysisCost !== null && lastTokenUsage !== null && (
            <div>
              <p>{t.lastAnalysisCost}: ¥{lastAnalysisCost.toFixed(4)}</p>
              <p>{t.lastTokenUsage}: {lastTokenUsage}</p>
            </div>
          )}

          {validationResult && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="validation-result">
                <AccordionTrigger>{t.validationResult}</AccordionTrigger>
                <AccordionContent>
                  <div dangerouslySetInnerHTML={{ __html: validationResult }} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  )
}