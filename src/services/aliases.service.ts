import { BaseApiService } from '../lib/axios';
import {
  Alias,
  AliasesListResponse,
  CreateAliasDto,
  UpdateAliasDto,
  MessageResponse,
} from '../types';

class AliasesService extends BaseApiService {
  async list(domainId: number): Promise<AliasesListResponse> {
    try {
      const response = await this.client.get<AliasesListResponse>(`/domains/${domainId}/aliases`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(domainId: number, data: CreateAliasDto): Promise<{ message: string; alias: Alias }> {
    try {
      const response = await this.client.post<{ message: string; alias: Alias }>(
        `/domains/${domainId}/aliases`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(domainId: number, id: number, data: UpdateAliasDto): Promise<{ message: string; alias: Alias }> {
    try {
      const response = await this.client.put<{ message: string; alias: Alias }>(
        `/domains/${domainId}/aliases/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(domainId: number, id: number): Promise<MessageResponse> {
    try {
      const response = await this.client.delete<MessageResponse>(`/domains/${domainId}/aliases/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const aliasesService = new AliasesService();
