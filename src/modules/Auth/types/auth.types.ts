export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  role: UserRole;
  subscription: SubscriptionPlan;
  permissions: UserPermissions;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  acceptTerms: boolean;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type UserRole = "admin" | "manager" | "user" | "technician";

export type SubscriptionPlan = "basic" | "professional" | "enterprise";

export interface UserPermissions {
  panels: ModulePermissions;
  projects: ModulePermissions;
  reports: ReportPermissions;
  cabinets: ModulePermissions;
  schedule: ModulePermissions;
  testCards: ModulePermissions;
  technicians: ModulePermissions;
  users: ModulePermissions;
}

export interface ModulePermissions {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface ReportPermissions extends ModulePermissions {
  commercial: boolean;
  technical: boolean;
  advanced: boolean;
  export: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}
