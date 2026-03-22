import { pgTable, text, integer, timestamp, jsonb, decimal, boolean, serial } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

// Users table for authentication
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Sessions table for Better-Auth
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

// Accounts table for OAuth providers
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
});

// Students table for certificate recipients
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rollNo: text('roll_no').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Certificate Templates table for storing template designs
export const certificateTemplates = pgTable('certificate_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  // Template configuration stored as JSON
  config: jsonb('config').notNull().$type<CertificateTemplateConfig>(),
  // Width and height in points (A4 landscape default: 841.89 x 595.28)
  width: decimal('width', { precision: 10, scale: 2 }).notNull().default('841.89'),
  height: decimal('height', { precision: 10, scale: 2 }).notNull().default('595.28'),
  // Background color or image URL
  backgroundColor: text('background_color').default('#FFFFFF'),
  backgroundImageUrl: text('background_image_url'),
  // Border configuration
  showBorder: boolean('show_border').default(true),
  borderColor: text('border_color').default('#1B2B4B'),
  borderWidth: decimal('border_width', { precision: 5, scale: 2 }).default('3'),
  // Inner decorative border
  showInnerBorder: boolean('show_inner_border').default(true),
  innerBorderColor: text('inner_border_color').default('#C9A84C'),
  innerBorderWidth: decimal('inner_border_width', { precision: 5, scale: 2 }).default('1'),
  // Text configurations
  titleText: text('title_text').notNull().default('Certificate of Completion'),
  titleFont: text('title_font').default('Helvetica-Bold'),
  titleSize: decimal('title_size', { precision: 5, scale: 2 }).default('36'),
  titleColor: text('title_color').default('#1B2B4B'),
  titleY: decimal('title_y', { precision: 10, scale: 2 }).default('150'),
  // Name field configuration
  nameFont: text('name_font').default('Helvetica-Bold'),
  nameSize: decimal('name_size', { precision: 5, scale: 2 }).default('28'),
  nameColor: text('name_color').default('#1B2B4B'),
  nameY: decimal('name_y', { precision: 10, scale: 2 }).default('240'),
  // Description text
  descriptionText: text('description_text').default('This is to certify that'),
  descriptionFont: text('description_font').default('Helvetica'),
  descriptionSize: decimal('description_size', { precision: 5, scale: 2 }).default('14'),
  descriptionColor: text('description_color').default('#1B2B4B'),
  descriptionY: decimal('description_y', { precision: 10, scale: 2 }).default('310'),
  // Event name configuration
  eventFont: text('event_font').default('Helvetica-Bold'),
  eventSize: decimal('event_size', { precision: 5, scale: 2 }).default('20'),
  eventColor: text('event_color').default('#C9A84C'),
  eventY: decimal('event_y', { precision: 10, scale: 2 }).default('340'),
  // Date configuration
  dateText: text('date_text').default('Date:'),
  dateFont: text('date_font').default('Helvetica-Oblique'),
  dateSize: decimal('date_size', { precision: 5, scale: 2 }).default('14'),
  dateColor: text('date_color').default('#1B2B4B'),
  dateY: decimal('date_y', { precision: 10, scale: 2 }).default('380'),
  // Issued by configuration
  issuedByFont: text('issued_by_font').default('Helvetica'),
  issuedBySize: decimal('issued_by_size', { precision: 5, scale: 2 }).default('12'),
  issuedByColor: text('issued_by_color').default('#1B2B4B'),
  issuedByY: decimal('issued_by_y', { precision: 10, scale: 2 }).default('420'),
  // Footer configuration
  footerText: text('footer_text').default('Roll No:'),
  footerFont: text('footer_font').default('Helvetica'),
  footerSize: decimal('footer_size', { precision: 5, scale: 2 }).default('10'),
  footerColor: text('footer_color').default('#C9A84C'),
  // Active flag
  isActive: boolean('is_active').default(true),
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Certificates table to track generated certificates
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  templateId: integer('template_id')
    .references(() => certificateTemplates.id, { onDelete: 'set null' }),
  eventName: text('event_name').notNull(),
  issuedBy: text('issued_by').notNull(),
  issueDate: text('issue_date').notNull(),
  pdfPath: text('pdf_path'),
  status: text('status', { 
    enum: ['pending', 'generated', 'sent', 'failed'] 
  }).default('pending').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Email logs table for tracking email delivery
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  certificateId: integer('certificate_id')
    .references(() => certificates.id, { onDelete: 'set null' }),
  recipientEmail: text('recipient_email').notNull(),
  subject: text('subject').notNull(),
  status: text('status', { 
    enum: ['pending', 'sent', 'delivered', 'bounced', 'failed'] 
  }).default('pending').notNull(),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  certificates: many(certificates),
}));

export const certificateTemplatesRelations = relations(certificateTemplates, ({ many }) => ({
  certificates: many(certificates),
}));

export const certificatesRelations = relations(certificates, ({ one, many }) => ({
  student: one(students, {
    fields: [certificates.studentId],
    references: [students.id],
  }),
  template: one(certificateTemplates, {
    fields: [certificates.templateId],
    references: [certificateTemplates.id],
  }),
  emailLogs: many(emailLogs),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  certificate: one(certificates, {
    fields: [emailLogs.certificateId],
    references: [certificates.id],
  }),
}));

// Type exports
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
export type Student = InferSelectModel<typeof students>;
export type NewStudent = InferInsertModel<typeof students>;
export type CertificateTemplate = InferSelectModel<typeof certificateTemplates>;
export type NewCertificateTemplate = InferInsertModel<typeof certificateTemplates>;
export type CertificateTemplateConfig = {
  elements?: TemplateElement[];
  logos?: TemplateLogo[];
  signatures?: TemplateSignature[];
};
export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  style?: Record<string, any>;
}
export interface TemplateLogo {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface TemplateSignature {
  id: string;
  label: string;
  imageUrl?: string;
  x: number;
  y: number;
  width: number;
}
export type Certificate = InferSelectModel<typeof certificates>;
export type NewCertificate = InferInsertModel<typeof certificates>;
export type CertificateStatus = Certificate['status'];
export type EmailLog = InferSelectModel<typeof emailLogs>;
export type NewEmailLog = InferInsertModel<typeof emailLogs>;
export type EmailLogStatus = EmailLog['status'];
