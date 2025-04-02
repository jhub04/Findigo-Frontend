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
  roles: Role[];
}

export interface UserLiteResponse {
  id: number;
  username: string;
}
