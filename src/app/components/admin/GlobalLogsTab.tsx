import React, { useState, useEffect } from 'react';
import { auditLogsService } from '../../../services';
import { AuditLog, PaginatedResponse } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export const GlobalLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<AuditLog>['pagination'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs(currentPage);
  }, [currentPage]);

  const loadLogs = async (page: number) => {
    setLoading(true);
    try {
      const data = await auditLogsService.list({ page });
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Nie udało się załadować logów');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeBadge = (eventType: string) => {
    if (eventType.includes('created')) return 'default';
    if (eventType.includes('updated')) return 'secondary';
    if (eventType.includes('deleted')) return 'destructive';
    if (eventType.includes('login')) return 'default';
    if (eventType.includes('logout')) return 'secondary';
    return 'outline';
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace('.', ' - ');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Ładowanie...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logi globalne</CardTitle>
        <CardDescription>Wszystkie operacje w systemie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak logów
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getEventTypeBadge(log.event_type)}>
                        {formatEventType(log.event_type)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-500">Akcja wykonana przez:</span>{' '}
                      <span className="font-medium">
                        {log.actor_type} #{log.actor_id}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Dotyczy:</span>{' '}
                      <span className="font-medium">
                        {log.entity_type} #{log.entity_id}
                      </span>
                    </p>
                    {log.ip_address && (
                      <p>
                        <span className="text-gray-500">IP:</span>{' '}
                        <span className="font-mono text-xs">{log.ip_address}</span>
                      </p>
                    )}
                  </div>

                  {log.new_value && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                        Pokaż szczegóły
                      </summary>
                      <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.new_value, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Strona {pagination.page} z {pagination.total_pages} ({pagination.total_items} wyników)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Poprzednia
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.total_pages}
                  >
                    Następna
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
