import { BaseApiService } from '../lib/axios';
import {
  AutoresponderResponse,
  FooterResponse,
  UpdateAutoresponderDto,
  MessageResponse,
} from '../types';

class MailboxProfileService extends BaseApiService {
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

  async getFooter(): Promise<FooterResponse> {
    try {
      const response = await this.client.get<FooterResponse>('/mailbox/footer');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateFooter(footerText: string | null): Promise<MessageResponse> {
    try {
      const response = await this.client.put<MessageResponse>('/mailbox/footer', {
        footer_text: footerText,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAutoresponder(): Promise<AutoresponderResponse> {
    try {
      const response = await this.client.get<AutoresponderResponse>('/mailbox/autoresponder');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateAutoresponder(data: UpdateAutoresponderDto): Promise<MessageResponse> {
    try {
      const response = await this.client.put<MessageResponse>('/mailbox/autoresponder', data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteAutoresponder(): Promise<MessageResponse> {
    try {
      const response = await this.client.delete<MessageResponse>('/mailbox/autoresponder');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const mailboxProfileService = new MailboxProfileService();
