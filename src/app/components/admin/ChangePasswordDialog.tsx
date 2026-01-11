import React, { useState, FormEvent } from 'react';
import { usersService } from '../../../services';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  userEmail: string;
  onSave: () => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  onSave,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Hasła nie pasują do siebie');
      return;
    }

    setLoading(true);
    try {
      await usersService.changePassword(userId, newPassword);
      toast.success('Hasło zostało zmienione');
      setNewPassword('');
      setConfirmPassword('');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zmiany hasła');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień hasło użytkownika</DialogTitle>
          <DialogDescription>{userEmail}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nowe hasło</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Potwierdź hasło</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Zmiana...' : 'Zmień hasło'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
