export type UserRole = 'administrator' | 'user' | 'mailbox';

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface User extends BaseEntity {
  email: string;
  firstname?: string;
  lastname?: string;
  role: UserRole;
  active: boolean;
  domains?: Domain[];
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  role: 'administrator' | 'user';
  active?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: 'administrator' | 'user';
  active?: boolean;
}

export interface Domain extends BaseEntity {
  name: string;
  active: boolean;
}

export interface CreateDomainDto {
  name: string;
  active?: boolean;
}

export interface UpdateDomainDto {
  name?: string;
  active?: boolean;
}

export interface Mailbox extends BaseEntity {
  email: string;
  name: string;
  footer_text: string | null;
  active: boolean;
  has_active_autoresponder: boolean;
}

// Mailbox profile returned from /api/me endpoint
export interface MailboxProfile extends BaseEntity {
  domain_id: number;
  name: string;
  active: boolean;
  footer_text: string | null;
  has_active_autoresponder: boolean;
  role: 'mailbox'; // Added for consistency
  email?: string; // Constructed from name@domain
}

export interface CreateMailboxDto {
  name: string;
  password: string;
  active?: boolean;
}

export interface UpdateMailboxDto {
  name?: string;
  active?: boolean;
}

export interface Alias extends BaseEntity {
  name: string;
  to: string;
  active: boolean;
}

export interface CreateAliasDto {
  name: string;
  to: string;
}

export interface UpdateAliasDto {
  name?: string;
  to?: string;
  active?: boolean;
}

export interface Autoresponder extends BaseEntity {
  active: boolean;
  subject: string;
  body: string;
  start_date: string | null;
  end_date: string | null;
}

export interface CreateAutoresponderDto {
  subject: string;
  body: string;
  active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

export interface UpdateAutoresponderDto extends CreateAutoresponderDto {}

export type ActorType = 'user' | 'mailbox';
export type EventType = 
  | 'user.created'
  | 'user.updated'
  | 'user.password_changed'
  | 'domain.created'
  | 'domain.updated'
  | 'domain.deleted'
  | 'mailbox.created'
  | 'mailbox.updated'
  | 'mailbox.password_changed'
  | 'mailbox.password_changed_by_admin'
  | 'mailbox.deleted'
  | 'alias.created'
  | 'alias.updated'
  | 'alias.deleted'
  | 'autoresponder.created'
  | 'autoresponder.updated'
  | 'autoresponder.deleted'
  | 'user_domain.assigned'
  | 'user_domain.unassigned';

export interface AuditLog extends BaseEntity {
  actor_type: ActorType;
  actor_id: number;
  event_type: EventType;
  entity_type: string;
  entity_id: number;
  old_value: any;
  new_value: any;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failed';
}

export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface UsersListResponse {
  users: User[];
  total: number;
}

export interface DomainsListResponse {
  domains: Domain[];
  total: number;
}

export interface DomainManagersResponse {
  managers: User[];
}

export interface MailboxesListResponse {
  mailboxes: Mailbox[];
  total: number;
}

export interface AliasesListResponse {
  aliases: Alias[];
  total: number;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  domain_id?: number;
  domain_name?: string;
  pagination: Pagination;
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface AutoresponderResponse {
  autoresponder: Autoresponder | null;
  message?: string;
}

export interface FooterResponse {
  id: number;
  footer_text: string | null;
}

// Union type for /api/me endpoint response
export type ProfileResponse = User | MailboxProfile;

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordByAdminDto {
  password: string;
}
