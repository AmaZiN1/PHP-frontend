import { BaseApiService } from '../lib/axios';
import { AuthResponse, MessageResponse, User, ProfileResponse } from '../types';

class AuthService extends BaseApiService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<MessageResponse> {
    try {
      const response = await this.client.post<MessageResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logoutAll(): Promise<MessageResponse> {
    try {
      const response = await this.client.post<MessageResponse>('/auth/logout-all');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.client.get<any>('/me');
      const data = response.data;
      
      // If domain_id exists, it's a mailbox profile
      if ('domain_id' in data && !('role' in data)) {
        return {
          ...data,
          role: 'mailbox' as const,
          email: data.email || `${data.name}@domain`,
        };
      }
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    try {
      const response = await this.client.put<MessageResponse>('/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const authService = new AuthService();
