import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services';
import { User } from '../types';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.list();
      setUsers(data.users || []);
    } catch (err: any) {
      const message = err.message || 'Nie udało się załadować użytkowników';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
  };
};
