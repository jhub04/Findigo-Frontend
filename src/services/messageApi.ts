import apiClient from "./apiClient";
import type { MessageRequest, MessageResponse } from '@/types/dto'

// Send message
export const sendMessage = async (message: MessageRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/messages/send', message);
    return response.data;
}

// Fetch all messages between userId1 and userId2 for a message thread
export const fetchMessageThread = async (userId1: number, userId2: number): Promise<MessageResponse[]> => {
    const response = await apiClient.get<MessageResponse[]>(`/messages/${userId1}/${userId2}`)
    return response.data
}

// Fetches all the users messages to display in message inbox 
export const fetchAllUserMessages = async (userId: number): Promise<MessageResponse[]> => {
    const response = await apiClient.get<MessageResponse[]>(`/messages/${userId}`)
    return response.data
}