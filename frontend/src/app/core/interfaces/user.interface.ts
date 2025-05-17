export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER'
}

export interface UserCreateDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
} 