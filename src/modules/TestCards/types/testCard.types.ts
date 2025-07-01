export interface TestCard {
  id: string;
  name: string;
  type: "panel" | "project" | "system";
  category: TestCardCategory;
  description?: string;
  instructions: TestInstruction[];
  expectedResults: TestResult[];
  qrCode?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestInstruction {
  id: string;
  step: number;
  title: string;
  description: string;
  expectedAction: string;
  timeout?: number; // seconds
  critical: boolean;
}

export interface TestResult {
  id: string;
  testCardId: string;
  executedBy: string;
  executedAt: Date;
  status: TestStatus;
  results: TestStepResult[];
  notes?: string;
  images?: string[];
}

export interface TestStepResult {
  instructionId: string;
  status: TestStatus;
  actualResult: string;
  notes?: string;
  timestamp: Date;
}

export type TestCardCategory =
  | "pixel-test"
  | "color-calibration"
  | "connectivity"
  | "power-test"
  | "stress-test"
  | "system-integration"
  | "performance"
  | "acceptance";

export type TestStatus =
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "skipped";

export interface TestCardTemplate {
  id: string;
  name: string;
  category: TestCardCategory;
  instructions: Omit<TestInstruction, "id">[];
  applicableTypes: ("panel" | "project" | "system")[];
}

export interface TestCardFilter {
  category?: TestCardCategory;
  type?: TestCard["type"];
  status?: TestStatus;
  executedBy?: string;
  dateRange?: [Date, Date];
}

export interface TestCardFormData {
  name: string;
  type: string;
  category: string;
  description: string;
  instructions: {
    title: string;
    description: string;
    expectedAction: string;
    timeout: string;
    critical: boolean;
  }[];
}
