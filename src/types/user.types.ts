export type RegristrationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  regristrationStatus: RegristrationStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string
  email: string;
  password: string;
  secertCode?: string;
}

export interface LoginResponse {
  user?: User;
  message: string;
  status: RegristrationStatus;
  requiresApproval?: boolean;
}

export interface RegistrationResponse {
  user: User;
  message: string;
  status: RegristrationStatus;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
  status?: RegristrationStatus
  isActive?: boolean;
}

export interface ApproveUserDto {
  userId: number;
}

export interface RejectUserDto {
  userId: number;
  reason?: string;
}

export interface PendingUser {
  id: number;
  email: string;
  neme: string;
  role: 'admin' | 'user';
  status: RegristrationStatus;
  createdAt: Date;
}
