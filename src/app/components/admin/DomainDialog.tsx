import React, { useState, useEffect, FormEvent } from 'react';
import { domainsService } from '../../../services';
import { Domain } from '../../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface DomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: Domain | null;
  onSave: () => void;
}

export const DomainDialog: React.FC<DomainDialogProps> = ({ open, onOpenChange, domain, onSave }) => {
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (domain) {
      setName(domain.name || '');
      setActive(domain.active ?? true);
    } else {
      setName('');
      setActive(true);
    }
  }, [domain]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (domain) {
        await domainsService.update(domain.id, { name, active });
        toast.success('Domena została zaktualizowana');
      } else {
        await domainsService.create({ name, active });
        toast.success('Domena została utworzona');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zapisywania domeny');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{domain ? 'Edytuj domenę' : 'Dodaj domenę'}</DialogTitle>
          <DialogDescription>
            {domain ? 'Zaktualizuj dane domeny' : 'Utwórz nową domenę'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa domeny</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="example.com"
              required
              disabled={loading || !!domain}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Aktywna</Label>
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
              {loading ? 'Zapisywanie...' : domain ? 'Zapisz' : 'Utwórz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
