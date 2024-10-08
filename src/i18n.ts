import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome to AI Product Manager Assistant',
    ideationPhase: 'Ideation Phase',
    userAnalysisPhase: 'User Analysis Phase',
    productFlowPhase: 'Product Flow Phase',
    featurePlanningPhase: 'Feature Planning Phase',
    prdGenerationPhase: 'PRD Generation Phase',
    targetAudience: 'Target Audience',
    describeTargetAudience: 'Describe your target audience',
    problemToSolve: 'Problem to Solve',
    describeProblem: 'Describe the problem you want to solve',
    analyzing: 'Analyzing...',
    validate: 'Validate',
    validationResult: 'Validation Result',
    pleaseCompleteAllFields: 'Please complete all fields',
    validationError: 'An error occurred during validation',
  },
  zh: {
    welcome: '欢迎使用 AI 产品经理助手',
    ideationPhase: '构思阶段',
    userAnalysisPhase: '用户分析阶段',
    productFlowPhase: '产品流程阶段',
    featurePlanningPhase: '功能规划阶段',
    prdGenerationPhase: 'PRD 生成阶段',
    targetAudience: '目标用户',
    describeTargetAudience: '描述您的目标用户',
    problemToSolve: '要解决的问题',
    describeProblem: '描述您想要解决的问题',
    analyzing: '分析中...',
    validate: '验证',
    validationResult: '验证结果',
    pleaseCompleteAllFields: '请完成所有字段',
    validationError: '验证过程中发生错误',
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
});

export default i18n;