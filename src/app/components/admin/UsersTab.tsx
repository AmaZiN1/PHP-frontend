import React, { useState } from 'react';
import { useUsers } from '../../../hooks';
import { usersService } from '../../../services';
import { User } from '../../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Key, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { UserDialog } from './UserDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export const UsersTab: React.FC = () => {
  const { users, loading, loadUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleChangePassword = (user: any) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  const handleLogoutAll = async (user: User) => {
    if (!confirm(`Czy na pewno chcesz wylogować wszystkie sesje użytkownika ${user.email}?`)) return;

    try {
      await usersService.logoutAll(user.id);
      toast.success('Wszystkie sesje zostały wylogowane');
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas wylogowywania sesji');
    }
  };

  const handleSave = async () => {
    await loadUsers();
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
            <CardTitle>Użytkownicy</CardTitle>
            <CardDescription>Zarządzaj użytkownikami systemu (administratorzy i zarządcy domen)</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Dodaj użytkownika
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak użytkowników
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangePassword(user)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutAll(user)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={handleSave}
      />

      {selectedUser && (
        <ChangePasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};
