export type GateAction = 'PASS' | 'VOID' | 'KENOSIS_GRAD_NULL' | 'HARD_INTERRUPT' | 'EMERGENCY_BLOCK';

export interface GateResult {
  isTriggered: boolean;
  status: string;
  metricName: string;
  metricValue: number;
  thresholdValue: number;
  action: GateAction;
  metadata: Record<string, any>;
}

export type TabType = 'overview' | 'discrete' | 'mcrg' | 'telemetry' | 'specs' | 'code';

export interface SpecItem {
  id: string;
  title: string;
  category: 'discrete' | 'mcrg' | 'telemetry';
  inputs: { text: string; tag: string };
  outputs: { text: string; tag: string };
  triggerCondition: { text: string; tag: string };
  sideEffects: { text: string; tag: string };
  edgeCases: { text: string; tag: string };
  tests: { text: string; tag: string };
}
