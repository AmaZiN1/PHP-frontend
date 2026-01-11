import { useState, useEffect, useCallback } from 'react';
import { mailboxesService } from '../services';
import { Mailbox } from '../types';
import { toast } from 'sonner';

export const useMailboxes = (domainId: number) => {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMailboxes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mailboxesService.list(domainId);
      setMailboxes(data.mailboxes || []);
    } catch (err: any) {
      const message = err.message || 'Nie udało się załadować mailboxów';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [domainId]);

  useEffect(() => {
    loadMailboxes();
  }, [loadMailboxes]);

  return {
    mailboxes,
    loading,
    error,
    loadMailboxes,
  };
};
