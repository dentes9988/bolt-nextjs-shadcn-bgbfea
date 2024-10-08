export interface UserType {
  description: string;
  ageRange: string;
  incomeSource: string;
  incomeRange: string;
  preferences?: string[];
  commonApps?: string[];
  motivation: string;
  beforeScenario: string;
  afterScenario: string;
}

export interface AnalysisResult {
  [key: string]: UserType;
}