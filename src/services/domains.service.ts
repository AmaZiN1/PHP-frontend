import { BaseApiService } from '../lib/axios';
import {
  Domain,
  DomainsListResponse,
  DomainManagersResponse,
  CreateDomainDto,
  UpdateDomainDto,
  MessageResponse,
} from '../types';

class DomainsService extends BaseApiService {
  async list(): Promise<DomainsListResponse> {
    try {
      const response = await this.client.get<DomainsListResponse>('/domains');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async myDomains(): Promise<DomainsListResponse> {
    try {
      const response = await this.client.get<DomainsListResponse>('/me/domains');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getManagers(id: number): Promise<DomainManagersResponse> {
    try {
      const response = await this.client.get<DomainManagersResponse>(`/domains/${id}/managers`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(data: CreateDomainDto): Promise<{ message: string; domain: Domain }> {
    try {
      const response = await this.client.post<{ message: string; domain: Domain }>('/domains', data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: number, data: UpdateDomainDto): Promise<{ message: string; domain: Domain }> {
    try {
      const response = await this.client.put<{ message: string; domain: Domain }>(`/domains/${id}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: number): Promise<MessageResponse> {
    try {
      const response = await this.client.delete<MessageResponse>(`/domains/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const domainsService = new DomainsService();
