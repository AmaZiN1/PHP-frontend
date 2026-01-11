import React, { useState, useEffect, FormEvent } from 'react';
import { usersService } from '../../../services';
import { User } from '../../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onSave }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState<'administrator' | 'user'>('user');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstname(user.firstname || '');
      setLastname(user.lastname || '');
      setRole((user.role === 'administrator' || user.role === 'user') ? user.role : 'user');
      setActive(user.active ?? true);
      setPassword('');
    } else {
      setEmail('');
      setPassword('');
      setFirstname('');
      setLastname('');
      setRole('user');
      setActive(true);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        await usersService.update(user.id, {
          email,
          firstname,
          lastname,
          active,
        });
        toast.success('Użytkownik został zaktualizowany');
      } else {
        await usersService.create({
          email,
          password,
          firstname,
          lastname,
          role,
          active,
        });
        toast.success('Użytkownik został utworzony');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zapisywania użytkownika');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edytuj użytkownika' : 'Dodaj użytkownika'}</DialogTitle>
          <DialogDescription>
            {user ? 'Zaktualizuj dane użytkownika' : 'Utwórz nowego użytkownika'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="firstname">Imię</Label>
            <Input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Nazwisko</Label>
            <Input
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="role">Rola</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Zarządca domen</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Aktywny</Label>
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Zapisywanie...' : user ? 'Zapisz' : 'Utwórz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
