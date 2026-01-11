import { useState, useEffect, useCallback } from 'react';
import { domainsService } from '../services';
import { User } from '../types';
import { toast } from 'sonner';

export const useDomainManagers = (domainId: number) => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await domainsService.getManagers(domainId);
      setManagers(data.managers || []);
    } catch (err: any) {
      const message = err.message || 'Nie udało się załadować zarządców';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [domainId]);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  return {
    managers,
    loading,
    error,
    loadManagers,
  };
};
