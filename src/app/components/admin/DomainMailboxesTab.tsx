import React, { useState } from 'react';
import { useMailboxes } from '../../../hooks';
import { mailboxesService } from '../../../services';
import { Mailbox } from '../../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Key, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { MailboxDialog } from './MailboxDialog';
import { ChangeMailboxPasswordDialog } from './ChangeMailboxPasswordDialog';

interface DomainMailboxesTabProps {
  domainId: number;
  domainName: string;
}

export const DomainMailboxesTab: React.FC<DomainMailboxesTabProps> = ({ domainId, domainName }) => {
  const { mailboxes, loading, loadMailboxes } = useMailboxes(domainId);
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedMailbox(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (mailbox: Mailbox) => {
    setSelectedMailbox(mailbox);
    setIsDialogOpen(true);
  };

  const handleChangePassword = (mailbox: Mailbox) => {
    setSelectedMailbox(mailbox);
    setIsPasswordDialogOpen(true);
  };

  const handleDelete = async (mailbox: Mailbox) => {
    if (!confirm(`Czy na pewno chcesz usunąć mailbox ${mailbox.name}@${domainName}?`)) return;

    try {
      await mailboxesService.delete(domainId, mailbox.id);
      toast.success('Skrzynka pocztowa została usunięta');
      await loadMailboxes();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas usuwania skrzynki pocztowej');
    }
  };

  const handleLogoutAll = async (mailbox: Mailbox) => {
    if (!confirm(`Czy na pewno chcesz wylogować wszystkie sesje skrzynki pocztowej ${mailbox.name}@${domainName}?`)) return;

    try {
      await mailboxesService.logoutAll(domainId, mailbox.id);
      toast.success('Wszystkie sesje zostały wylogowane');
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas wylogowywania sesji');
    }
  };

  const handleSave = async () => {
    await loadMailboxes();
    setIsDialogOpen(false);
    setIsPasswordDialogOpen(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Ładowanie...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skrzynki pocztowe</CardTitle>
            <CardDescription>Skrzynki pocztowe w domenie {domainName}</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Dodaj skrzynkę pocztową
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {mailboxes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak skrzynek pocztowych
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Poza biurem</TableHead>
                <TableHead>Data utworzenia</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mailboxes.map((mailbox) => (
                <TableRow key={mailbox.id}>
                  <TableCell>{mailbox.name}@{domainName}</TableCell>
                  <TableCell>
                    <Badge variant={mailbox.active ? 'default' : 'secondary'}>
                      {mailbox.active ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mailbox.has_active_autoresponder ? 'default' : 'outline'}>
                      {mailbox.has_active_autoresponder ? 'Tak' : 'Nie'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(mailbox.created_at).toLocaleString('pl-PL')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(mailbox)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangePassword(mailbox)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutAll(mailbox)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(mailbox)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <MailboxDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        domainId={domainId}
        domainName={domainName}
        mailbox={selectedMailbox}
        onSave={handleSave}
      />

      {selectedMailbox && (
        <ChangeMailboxPasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          domainId={domainId}
          mailboxId={selectedMailbox.id}
          mailboxEmail={selectedMailbox.email}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};
