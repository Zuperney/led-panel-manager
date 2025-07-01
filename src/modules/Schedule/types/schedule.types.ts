/**
 * Types for the Schedule module
 */

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  projectId?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  attendees: Attendee[];
  status: EventStatus;
  priority: EventPriority;
  reminders: Reminder[];
  recurrence?: RecurrenceRule;
  resources: Resource[];
  dependencies: EventDependency[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type EventType =
  | "installation"
  | "maintenance"
  | "meeting"
  | "training"
  | "delivery"
  | "testing"
  | "calibration"
  | "inspection"
  | "other";

export type EventStatus =
  | "scheduled"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "postponed";

export type EventPriority = "low" | "medium" | "high" | "critical";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  role: string;
  required: boolean;
  status: AttendeeStatus;
}

export type AttendeeStatus = "pending" | "accepted" | "declined" | "tentative";

export interface Reminder {
  id: string;
  type: ReminderType;
  time: number; // minutes before event
  message?: string;
}

export type ReminderType = "email" | "sms" | "push" | "popup";

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  quantity: number;
  cost?: number;
  availability: ResourceAvailability;
}

export type ResourceType =
  | "equipment"
  | "vehicle"
  | "tool"
  | "material"
  | "personnel"
  | "facility";

export interface ResourceAvailability {
  available: boolean;
  conflicts: ResourceConflict[];
  nextAvailable?: Date;
}

export interface ResourceConflict {
  eventId: string;
  eventTitle: string;
  startDate: Date;
  endDate: Date;
}

export interface EventDependency {
  eventId: string;
  type: DependencyType;
  lag: number; // hours
}

export type DependencyType =
  | "finish-to-start"
  | "start-to-start"
  | "finish-to-finish"
  | "start-to-finish";

export interface ScheduleView {
  type: ViewType;
  startDate: Date;
  endDate: Date;
  filters: ScheduleFilters;
}

export type ViewType =
  | "day"
  | "week"
  | "month"
  | "year"
  | "agenda"
  | "timeline";

export interface ScheduleFilters {
  eventTypes?: EventType[];
  projects?: string[];
  attendees?: string[];
  status?: EventStatus[];
  priority?: EventPriority[];
  resources?: string[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  events: ScheduleEvent[];
  conflicts: ScheduleConflict[];
}

export interface ScheduleConflict {
  type: ConflictType;
  events: string[];
  severity: ConflictSeverity;
  resolution?: string;
}

export type ConflictType =
  | "resource-conflict"
  | "attendee-conflict"
  | "dependency-violation"
  | "time-overlap";

export type ConflictSeverity = "info" | "warning" | "error" | "critical";

export interface ScheduleSummary {
  totalEvents: number;
  upcomingEvents: number;
  overdueEvents: number;
  completedEvents: number;
  conflictsCount: number;
  utilizationRate: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  type: EventType;
  projectId?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  attendees: Omit<Attendee, "id" | "status">[];
  priority: EventPriority;
  reminders: Omit<Reminder, "id">[];
  recurrence?: RecurrenceRule;
  resources: Omit<Resource, "availability">[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
}
