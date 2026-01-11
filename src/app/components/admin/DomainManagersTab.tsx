import React, { useState } from 'react';
import { useDomainManagers } from '../../../hooks';
import { usersService } from '../../../services';
import { User } from '../../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AssignManagerDialog } from './AssignManagerDialog';

interface DomainManagersTabProps {
  domainId: number;
}

export const DomainManagersTab: React.FC<DomainManagersTabProps> = ({ domainId }) => {
  const { managers: users, loading, loadManagers } = useDomainManagers(domainId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUnassign = async (userId: number) => {
    if (!confirm('Czy na pewno chcesz odpiąć tego użytkownika od domeny?')) return;

    try {
      await usersService.unassignDomain(userId, domainId);
      toast.success('Użytkownik został odpisany od domeny');
      await loadManagers();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas odpinania użytkownika');
    }
  };

  const handleSave = async () => {
    await loadManagers();
    setIsDialogOpen(false);
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
            <CardTitle>Zarządcy domeny</CardTitle>
            <CardDescription>Użytkownicy przypisani do tej domeny</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Przypisz użytkownika
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak przypisanych użytkowników
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Imię i nazwisko</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstname} {user.lastname}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'administrator' ? 'default' : 'secondary'}>
                      {user.role === 'administrator' ? 'Administrator' : 'Zarządca'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? 'default' : 'secondary'}>
                      {user.active ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AssignManagerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        domainId={domainId}
        onSave={handleSave}
      />
    </Card>
  );
};
