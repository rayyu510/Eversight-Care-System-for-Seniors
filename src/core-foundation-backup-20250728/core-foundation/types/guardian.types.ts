export interface GuardianConfig {
  id: string;
  moduleName: string;
  isEnabled: boolean;
  settings: Record<string, any>;
}
