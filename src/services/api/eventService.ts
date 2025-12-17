/**
 * Event Service
 * Handles event management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {Event} from '../../types';

export interface CreateEventRequest {
  masjidId: string;
  name: string;
  description?: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM
  location?: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
}

export const eventService = {
  /**
   * Get upcoming events
   */
  async getUpcomingEvents(
    masjidId: string,
  ): Promise<ApiResponse<Event[]>> {
    const response = await apiClient.get<ApiResponse<Event[]>>(
      API_ENDPOINTS.UPCOMING_EVENTS(masjidId),
    );
    return response.data;
  },

  /**
   * Get past events
   */
  async getPastEvents(
    masjidId: string,
    params?: {
      page?: number;
      limit?: number;
    },
  ): Promise<ApiResponse<Event[]>> {
    const response = await apiClient.get<ApiResponse<Event[]>>(
      API_ENDPOINTS.PAST_EVENTS(masjidId),
      {params},
    );
    return response.data;
  },

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    const response = await apiClient.get<ApiResponse<Event>>(
      API_ENDPOINTS.EVENT_BY_ID(eventId),
    );
    return response.data;
  },

  /**
   * Get all events by masjid
   */
  async getEventsByMasjid(
    masjidId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<ApiResponse<Event[]>> {
    const response = await apiClient.get<ApiResponse<Event[]>>(
      API_ENDPOINTS.EVENTS_BY_MASJID(masjidId),
      {params},
    );
    return response.data;
  },

  /**
   * Create event (Requires can_create_events permission)
   */
  async createEvent(data: CreateEventRequest): Promise<ApiResponse<Event>> {
    const response = await apiClient.post<ApiResponse<Event>>(
      API_ENDPOINTS.CREATE_EVENT,
      data,
    );
    return response.data;
  },

  /**
   * Update event (Requires can_create_events permission or be creator)
   */
  async updateEvent(
    eventId: string,
    data: UpdateEventRequest,
  ): Promise<ApiResponse<Event>> {
    const response = await apiClient.put<ApiResponse<Event>>(
      API_ENDPOINTS.UPDATE_EVENT(eventId),
      data,
    );
    return response.data;
  },

  /**
   * Delete event (Requires can_create_events permission or be creator)
   */
  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.DELETE_EVENT(eventId),
    );
    return response.data;
  },
};

