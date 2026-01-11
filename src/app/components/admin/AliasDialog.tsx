import React, { useState, useEffect, FormEvent } from 'react';
import { aliasesService } from '../../../services';
import { Alias } from '../../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface AliasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainId: number;
  alias: Alias | null;
  onSave: () => void;
}

export const AliasDialog: React.FC<AliasDialogProps> = ({ open, onOpenChange, domainId, alias, onSave }) => {
  const [sourceUsername, setSourceUsername] = useState('');
  const [destination, setDestination] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alias) {
      const username = alias.name.split('@')[0];
      setSourceUsername(username);
      setDestination(alias.to || '');
      setActive(alias.active ?? true);
    } else {
      setSourceUsername('');
      setDestination('');
      setActive(true);
    }
  }, [alias]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (alias) {
        await aliasesService.update(domainId, alias.id, { 
          name: sourceUsername,
          to: destination,
          active
        });
        toast.success('Alias został zaktualizowany');
      } else {
        await aliasesService.create(domainId, {
          name: sourceUsername,
          to: destination,
        });
        toast.success('Alias został utworzony');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zapisywania aliasu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{alias ? 'Edytuj alias' : 'Dodaj alias'}</DialogTitle>
          <DialogDescription>
            {alias ? 'Zaktualizuj dane aliasu' : 'Utwórz nowy alias'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Nazwa użytkownika (przed @)</Label>
            <Input
              id="source"
              value={sourceUsername}
              onChange={(e) => setSourceUsername(e.target.value)}
              placeholder="info"
              required
              disabled={loading || !!alias}
            />
            {alias && (
              <p className="text-xs text-gray-500">Pełny adres: {alias.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Przekierowanie do</Label>
            <Input
              id="destination"
              type="email"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

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
              {loading ? 'Zapisywanie...' : alias ? 'Zapisz' : 'Utwórz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
