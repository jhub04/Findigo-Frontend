export interface CategoryRequest {
  name: string;
}

export interface AttributeRequest {
  name: string;
  type: string;
  categoryId: number;
}

export type Role = 'USER' | 'ADMIN';

export interface UserRequest {
  username: string;
  password: string;
  phoneNumber: number;
  roles: Role[];
}

export interface UserLiteResponse {
  id: number;
  username: string;
  phoneNumber: number;
}
