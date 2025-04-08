import type { Role, UserLiteResponse } from './adminDto'

export interface AuthResponse {
  token: string;
}

// ikke userId, hentes fra innlogging = sikkert
export interface ListingRequest {
  briefDescription: string;
  fullDescription: string;
  longitude: number;
  latitude: number;
  price: number;
  address: string;
  postalCode: string;
  categoryId: number;
  attributes: ListingAttributeRequest[];
}

export interface ListingResponse {
  id: number;
  briefDescription: string;
  fullDescription: string;
  longitude: number;
  latitude: number;
  price: number;
  address: string;
  postalCode: string;
  numberOfImages: number;
  dateCreated: string;
  category: CategoryResponse;
  user: UserLiteResponse;
  attributes: ListingAttributeResponse[];
}

export interface ListingAttributeRequest {
  attributeId: number;
  value: string;
}

export interface UserResponse {
  id: number;
  username: string;
  phoneNumber: string;
  listings: ListingResponse[];
  roles: Role[];
}

export interface CategoryResponse {
  id: number;
  name: string;
  attributes: AttributeDef[];
}

export interface AttributeDef {
  id: number;
  name: string;
  type: 'string' | 'number' | 'boolean';
}

export interface ListingAttributeResponse {
  name: string;
  value: string;
}

export interface MessageRequest {
  fromUserId: number;
  toUserId: number;
  messageText: string;
}

export interface MessageResponse {
  fromUserId: number;
  fromUsername: string;
  toUserId: number;
  toUsername: string;
  messageText: string;
  messageId: number;
  read: boolean;
  sentAt: string;
}

export interface AttributeResponse {
  id: number;
  name: string;
  type: string;
}

export interface FilterRequest {
  categoryId?: number | null;
  query?: string | null;
  fromPrice?: number | null;
  toPrice?: number | null;
  fromDate?: string | null;
}

export interface MyUserRequest {
  username: string;
  password: string;
  phoneNumber: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface SaleResponse {
  id: number;
  listingId: number;
  salePrice: number;
  saleDate: string
}


