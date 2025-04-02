import type { UserLiteResponse } from '@/types/adminDto.ts'

export interface TokenResponse {
  token: string;
}

// ikke userId, hentes fra innlogging = sikkert
export interface ListingRequest {
  briefDescription: string;
  fullDescription: string;
  longitude: number;
  latitude: number;
  categoryId: number;
  attributes: ListingAttributeRequest[];
  imageUrls?: string[];
}

export interface ListingResponse {
  id: number;
  briefDescription: string;
  fullDescription: string;
  longitude: number;
  latitude: number;
  imageUrls: string[];
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
  listings: ListingResponse[]
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

export interface AttributeResponse {
  id: number;
  name: string;
  type: string;
}
