import { useState, useEffect, useCallback } from 'react';
import { aliasesService } from '../services';
import { Alias } from '../types';
import { toast } from 'sonner';

export const useAliases = (domainId: number) => {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAliases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aliasesService.list(domainId);
      setAliases(data.aliases || []);
    } catch (err: any) {
      const message = err.message || 'Nie udało się załadować aliasów';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [domainId]);

  useEffect(() => {
    loadAliases();
  }, [loadAliases]);

  return {
    aliases,
    loading,
    error,
    loadAliases,
  };
};
