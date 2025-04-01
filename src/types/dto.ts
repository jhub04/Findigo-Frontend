
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
}

export interface ListingResponse {
  id: number;
  briefDescription: string;
  fullDescription: string;
  longitude: number;
  latitude: number;
  category: CategoryResponse;
  user: UserResponse;
  attributes: ListingAttributeResponse[];
}

export interface ListingAttributeRequest {
  attributeId: number;
  value: string;
}

export interface UserResponse {
  id: number;
  username: string;
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
