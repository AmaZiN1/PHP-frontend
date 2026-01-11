import { BaseApiService } from '../lib/axios';
import { AuditLogsResponse } from '../types';

class AuditLogsService extends BaseApiService {
  async list(params?: { page?: number; domain_id?: number }): Promise<AuditLogsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.domain_id) queryParams.append('domain_id', params.domain_id.toString());

      const response = await this.client.get<AuditLogsResponse>(`/audit-logs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const auditLogsService = new AuditLogsService();
