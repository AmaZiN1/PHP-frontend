import { BaseApiService } from '../lib/axios';
import {
  Mailbox,
  MailboxesListResponse,
  CreateMailboxDto,
  UpdateMailboxDto,
  MessageResponse,
} from '../types';

class MailboxesService extends BaseApiService {
  async list(domainId: number): Promise<MailboxesListResponse> {
    try {
      const response = await this.client.get<MailboxesListResponse>(`/domains/${domainId}/mailboxes`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(domainId: number, data: CreateMailboxDto): Promise<{ message: string; mailbox: Mailbox }> {
    try {
      const response = await this.client.post<{ message: string; mailbox: Mailbox }>(
        `/domains/${domainId}/mailboxes`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(domainId: number, id: number, data: UpdateMailboxDto): Promise<{ message: string; mailbox: Mailbox }> {
    try {
      const response = await this.client.put<{ message: string; mailbox: Mailbox }>(
        `/domains/${domainId}/mailboxes/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(domainId: number, id: number, newPassword: string): Promise<MessageResponse> {
    try {
      const response = await this.client.put<MessageResponse>(`/domains/${domainId}/mailboxes/${id}/password`, {
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logoutAll(domainId: number, id: number): Promise<MessageResponse> {
    try {
      const response = await this.client.post<MessageResponse>(`/domains/${domainId}/mailboxes/${id}/logout-all`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(domainId: number, id: number): Promise<MessageResponse> {
    try {
      const response = await this.client.delete<MessageResponse>(`/domains/${domainId}/mailboxes/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const mailboxesService = new MailboxesService();
