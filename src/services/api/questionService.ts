/**
 * Question Service
 * Handles question submission and management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS, API_CONFIG} from '../../config/api.config';
import {Question} from '../../types';

export interface SubmitQuestionRequest {
  masjidId: string;
  userName: string;
  userEmail?: string;
  title: string;
  question: string;
}

export interface ReplyToQuestionRequest {
  reply: string;
}

export interface QuestionStatistics {
  total: number;
  new: number;
  replied: number;
  archived: number;
}

export interface UpdateQuestionStatusRequest {
  status: 'new' | 'replied' | 'archived';
}

export const questionService = {
  /**
   * Submit a question (PUBLIC - No auth required)
   */
  async submitQuestion(
    data: SubmitQuestionRequest,
  ): Promise<ApiResponse<Question>> {
    const response = await apiClient.post<ApiResponse<Question>>(
      API_ENDPOINTS.SUBMIT_QUESTION,
      data,
    );
    return response.data;
  },

  /**
   * Get all questions (Super Admin only)
   */
  async getAllQuestions(params?: {
    page?: number;
    limit?: number;
    status?: 'new' | 'replied' | 'archived';
    search?: string;
    masjidId?: string;
  }): Promise<ApiResponse<Question[]>> {
    const response = await apiClient.get<ApiResponse<Question[]>>(
      API_ENDPOINTS.ALL_QUESTIONS,
      {params},
    );
    return response.data;
  },

  /**
   * Get questions by masjid (Requires can_view_questions permission)
   */
  async getQuestionsByMasjid(
    masjidId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: 'new' | 'replied' | 'archived';
      search?: string;
    },
  ): Promise<ApiResponse<Question[]>> {
    const response = await apiClient.get<ApiResponse<Question[]>>(
      API_ENDPOINTS.QUESTIONS_BY_MASJID(masjidId),
      {params},
    );
    return response.data;
  },

  /**
   * Get question by ID
   */
  async getQuestionById(questionId: string): Promise<ApiResponse<Question>> {
    const response = await apiClient.get<ApiResponse<Question>>(
      API_ENDPOINTS.QUESTION_BY_ID(questionId),
    );
    return response.data;
  },

  /**
   * Reply to a question (Requires can_answer_questions permission)
   * Uses PUT method to /questions/{questionId}/reply endpoint
   */
  async replyToQuestion(
    questionId: string,
    data: ReplyToQuestionRequest,
  ): Promise<ApiResponse<Question>> {
    try {
      const endpoint = API_ENDPOINTS.REPLY_TO_QUESTION(questionId);
      
      // Import storage to check token
      const {storage} = await import('../../utils/storage');
      const token = await storage.getAccessToken();
      
      // Log request details with token info
      console.log('📤 Sending reply request:', {
        endpoint,
        fullUrl: `${API_CONFIG.BASE_URL}${endpoint}`,
        method: 'PUT',
        questionId,
        requestBody: data,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 15)}...${token.substring(token.length - 10)}` : 'none',
        tokenFormat: token ? (token.split('.').length === 3 ? 'Valid JWT format' : 'Invalid JWT format') : 'No token',
      });

      // Validate request data
      if (!data.reply || typeof data.reply !== 'string') {
        throw new Error('Reply must be a non-empty string');
      }

      // Validate token exists
      if (!token) {
        throw new Error('No access token found. Please login again.');
      }

      const response = await apiClient.put<ApiResponse<Question>>(
        endpoint,
        data,
      );
      
      console.log('✅ Reply response received:', {
        success: response.data.success,
        message: response.data.message,
        hasData: !!response.data.data,
      });
      return response.data;
    } catch (error: any) {
      // Log detailed error for debugging
      const errorResponse = error?.response?.data;
      const status = error?.response?.status;
      
      console.error('❌ Question service reply error:', {
        questionId,
        endpoint: API_ENDPOINTS.REPLY_TO_QUESTION(questionId),
        fullUrl: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REPLY_TO_QUESTION(questionId)}`,
        requestData: data,
        status,
        statusText: error?.response?.statusText,
        errorMessage: errorResponse?.message || error.message,
        errorResponse: errorResponse,
      });
      
      // Log full error response for debugging
      if (errorResponse) {
        console.error('📋 Full Error Response:', JSON.stringify(errorResponse, null, 2));
        
        // Check for permission-related errors
        if (status === 403 || errorResponse.message?.toLowerCase().includes('permission')) {
          console.error('🚫 Permission Error Detected:', {
            message: errorResponse.message,
            errors: errorResponse.errors,
            suggestion: 'Check if user has can_answer_questions permission for this masjid',
          });
        }
      }
      
      // Log request headers if available
      if (error?.config?.headers) {
        const authHeader = error.config.headers.Authorization;
        console.error('📤 Request Headers:', {
          Authorization: authHeader 
            ? `${(authHeader as string).substring(0, 25)}...` 
            : 'NOT SET',
          'Content-Type': error.config.headers['Content-Type'],
        });
      }
      
      throw error;
    }
  },

  /**
   * Update question status
   */
  async updateQuestionStatus(
    questionId: string,
    data: UpdateQuestionStatusRequest,
  ): Promise<ApiResponse<Question>> {
    const response = await apiClient.put<ApiResponse<Question>>(
      API_ENDPOINTS.UPDATE_QUESTION_STATUS(questionId),
      data,
    );
    return response.data;
  },

  /**
   * Get question statistics
   */
  async getQuestionStatistics(
    masjidId: string,
  ): Promise<ApiResponse<QuestionStatistics>> {
    const response = await apiClient.get<ApiResponse<QuestionStatistics>>(
      API_ENDPOINTS.QUESTION_STATISTICS(masjidId),
    );
    return response.data;
  },

  /**
   * Delete question (Admin only)
   */
  async deleteQuestion(questionId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.DELETE_QUESTION(questionId),
    );
    return response.data;
  },
};

