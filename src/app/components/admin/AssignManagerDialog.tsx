import React, { useState, useEffect, FormEvent } from 'react';
import { usersService, domainsService } from '../../../services';
import { User } from '../../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface AssignManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainId: number;
  onSave: () => void;
}

export const AssignManagerDialog: React.FC<AssignManagerDialogProps> = ({
  open,
  onOpenChange,
  domainId,
  onSave,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open, domainId]);

  const loadUsers = async () => {
    try {
      const [allUsersData, managersData] = await Promise.all([
        usersService.list(),
        domainsService.getManagers(domainId)
      ]);
      
      const assignedManagerIds = (managersData.managers || []).map((m: User) => m.id);
      
      const availableUsers = (allUsersData.users || []).filter(
        (u: User) => !assignedManagerIds.includes(u.id)
      );
      setUsers(availableUsers);
    } catch (error: any) {
      toast.error(error.message || 'Nie udało się załadować użytkowników');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Wybierz użytkownika');
      return;
    }

    setLoading(true);
    try {
      await usersService.assignDomain(parseInt(selectedUserId), domainId);
      toast.success('Użytkownik został przypisany do domeny');
      setSelectedUserId('');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas przypisywania użytkownika');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Przypisz użytkownika do domeny</DialogTitle>
          <DialogDescription>Wybierz użytkownika, który będzie zarządzał tą domeną</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Użytkownik</Label>
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">Brak dostępnych użytkowników do przypisania</p>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz użytkownika" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.email} ({user.firstname} {user.lastname})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading || users.length === 0}>
              {loading ? 'Przypisywanie...' : 'Przypisz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
