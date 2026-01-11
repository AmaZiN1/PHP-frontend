import React, { useState, useEffect, FormEvent } from 'react';
import { mailboxesService } from '../../../services';
import { Mailbox } from '../../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface MailboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainId: number;
  domainName: string;
  mailbox: Mailbox | null;
  onSave: () => void;
}

export const MailboxDialog: React.FC<MailboxDialogProps> = ({
  open,
  onOpenChange,
  domainId,
  domainName,
  mailbox,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mailbox) {
      setName(mailbox.name || '');
      setActive(mailbox.active ?? true);
      setPassword('');
    } else {
      setName('');
      setPassword('');
      setActive(true);
    }
  }, [mailbox]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mailbox) {
        await mailboxesService.update(domainId, mailbox.id, {
          name,
          active,
        });
        toast.success('Skrzynka pocztowa została zaktualizowana');
      } else {
        await mailboxesService.create(domainId, {
          name,
          password,
          active,
        });
        toast.success('Skrzynka pocztowa została utworzona');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zapisywania skrzynki pocztowej');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mailbox ? 'Edytuj skrzynkę pocztową' : 'Dodaj skrzynkę pocztową'}</DialogTitle>
          <DialogDescription>
            {mailbox ? 'Zaktualizuj dane skrzynki pocztowej' : `Utwórz nową skrzynkę pocztową w domenie ${domainName}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa użytkownika (przed @)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="john"
              required
              disabled={loading || !!mailbox}
            />
            <p className="text-xs text-gray-500">
              Pełny adres: {name || '...'}@{domainName}
            </p>
          </div>

          {!mailbox && (
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
              {loading ? 'Zapisywanie...' : mailbox ? 'Zapisz' : 'Utwórz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
