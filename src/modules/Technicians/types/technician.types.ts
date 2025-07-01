export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: TechnicianSpecialty[];
  certifications: Certification[];
  experience: number; // years
  hourlyRate?: number;
  isActive: boolean;
  availability: TechnicianAvailability;
  address: Address;
  notes?: string;
  rating: number;
  totalProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicianSpecialty {
  id: string;
  name: string;
  category: SpecialtyCategory;
  level: SkillLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verified: boolean;
}

export interface TechnicianAvailability {
  schedule: WeeklySchedule;
  timeZone: string;
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  unavailableDates: Date[];
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProjectAssignment {
  id: string;
  technicianId: string;
  projectId: string;
  role: AssignmentRole;
  assignedAt: Date;
  startDate: Date;
  endDate?: Date;
  status: AssignmentStatus;
  notificationsSent: boolean;
}

export interface TechnicianNotification {
  id: string;
  technicianId: string;
  projectId: string;
  type: NotificationType;
  title: string;
  message: string;
  sentAt: Date;
  readAt?: Date;
  emailSent: boolean;
  smsSent: boolean;
}

export type SpecialtyCategory =
  | "installation"
  | "maintenance"
  | "programming"
  | "troubleshooting"
  | "testing"
  | "calibration";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type AssignmentRole = "lead" | "assistant" | "specialist" | "supervisor";

export type AssignmentStatus =
  | "assigned"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type NotificationType =
  | "assignment"
  | "schedule-change"
  | "deadline-reminder"
  | "completion-request"
  | "feedback-request";

export interface TechnicianFilter {
  specialties?: string[];
  availability?: Date;
  experience?: [number, number];
  rating?: number;
  location?: {
    city?: string;
    state?: string;
    radius?: number; // km
  };
  searchTerm?: string;
}

export interface TechnicianFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  hourlyRate: string;
  specialties: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  availability: {
    timeZone: string;
    workingDays: number[];
  };
  notes: string;
}
