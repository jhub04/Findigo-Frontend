export interface CategoryRequest {
  name: string;
}

export interface AttributeRequest {
  name: string;
  type: string;
  categoryId: number;
}

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface AdminUserRequest {
  username: string;
  password: string;
  phoneNumber: string;
  roles: Role[];
}

export interface UserLiteResponse {
  id: number;
  username: string;
  phoneNumber: string;
}
