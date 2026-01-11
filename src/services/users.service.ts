import { BaseApiService } from '../lib/axios';
import {
  User,
  UsersListResponse,
  CreateUserDto,
  UpdateUserDto,
  MessageResponse,
} from '../types';

class UsersService extends BaseApiService {
  async list(): Promise<UsersListResponse> {
    try {
      const response = await this.client.get<UsersListResponse>('/users');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async get(id: number): Promise<User> {
    try {
      const response = await this.client.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(data: CreateUserDto): Promise<{ message: string; user: User }> {
    try {
      const response = await this.client.post<{ message: string; user: User }>('/users', data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<{ message: string; user: User }> {
    try {
      const response = await this.client.put<{ message: string; user: User }>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(id: number, newPassword: string): Promise<MessageResponse> {
    try {
      const response = await this.client.put<MessageResponse>(`/users/${id}/password`, {
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logoutAll(id: number): Promise<MessageResponse> {
    try {
      const response = await this.client.post<MessageResponse>(`/users/${id}/logout-all`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async assignDomain(userId: number, domainId: number): Promise<MessageResponse> {
    try {
      const response = await this.client.post<MessageResponse>(`/users/${userId}/domains/${domainId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async unassignDomain(userId: number, domainId: number): Promise<MessageResponse> {
    try {
      const response = await this.client.delete<MessageResponse>(`/users/${userId}/domains/${domainId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const usersService = new UsersService();
