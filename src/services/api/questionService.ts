/**
 * Question Service
 * Handles question submission and management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
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
    const reply = data.reply.trim();
    if (reply.length < 10) {
      throw new Error('Reply must be at least 10 characters');
    }

    const response = await apiClient.put<ApiResponse<Question>>(
      API_ENDPOINTS.REPLY_TO_QUESTION(questionId),
      {reply},
    );
    return response.data;
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

