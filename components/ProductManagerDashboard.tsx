"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeationPhase } from './phases/IdeationPhase'
import { UserAnalysisPhase } from './phases/UserAnalysisPhase'
import { ProductFlowPhase } from './phases/ProductFlowPhase'
import { FeaturePlanningPhase } from './phases/FeaturePlanningPhase'
import { PRDGenerationPhase } from './phases/PRDGenerationPhase'
import { useLanguage } from '@/lib/LanguageContext'
import { translations } from '@/lib/translations'

export function ProductManagerDashboard() {
  const [currentPhase, setCurrentPhase] = useState('ideation')
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Tabs value={currentPhase} onValueChange={setCurrentPhase} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="ideation">{t.ideationPhase}</TabsTrigger>
        <TabsTrigger value="userAnalysis">{t.userAnalysisPhase}</TabsTrigger>
        <TabsTrigger value="productFlow">{t.productFlowPhase}</TabsTrigger>
        <TabsTrigger value="featurePlanning">{t.featurePlanningPhase}</TabsTrigger>
        <TabsTrigger value="prdGeneration">{t.prdGenerationPhase}</TabsTrigger>
      </TabsList>
      <TabsContent value="ideation">
        <IdeationPhase />
      </TabsContent>
      <TabsContent value="userAnalysis">
        <UserAnalysisPhase />
      </TabsContent>
      <TabsContent value="productFlow">
        <ProductFlowPhase />
      </TabsContent>
      <TabsContent value="featurePlanning">
        <FeaturePlanningPhase />
      </TabsContent>
      <TabsContent value="prdGeneration">
        <PRDGenerationPhase />
      </TabsContent>
    </Tabs>
  )
}