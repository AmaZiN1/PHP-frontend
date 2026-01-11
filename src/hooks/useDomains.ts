import { useState, useEffect, useCallback } from 'react';
import { domainsService } from '../services';
import { Domain } from '../types';
import { useAuth } from '../app/contexts/AuthContext';
import { toast } from 'sonner';

export const useDomains = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'administrator';

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin ? await domainsService.list() : await domainsService.myDomains();
      setDomains(data.domains || []);
    } catch (err: any) {
      const message = err.message || 'Nie udało się załadować domen';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  const createDomain = async (name: string, active: boolean = true) => {
    try {
      await domainsService.create({ name, active });
      toast.success('Domena została utworzona');
      await loadDomains();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Błąd podczas tworzenia domeny');
      return false;
    }
  };

  const updateDomain = async (id: number, name: string, active: boolean) => {
    try {
      await domainsService.update(id, { name, active });
      toast.success('Domena została zaktualizowana');
      await loadDomains();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Błąd podczas aktualizacji domeny');
      return false;
    }
  };

  const deleteDomain = async (id: number) => {
    try {
      await domainsService.delete(id);
      toast.success('Domena została usunięta');
      await loadDomains();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Błąd podczas usuwania domeny');
      return false;
    }
  };

  return {
    domains,
    loading,
    error,
    loadDomains,
    createDomain,
    updateDomain,
    deleteDomain,
  };
};
