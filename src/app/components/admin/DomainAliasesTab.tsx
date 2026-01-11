import React, { useState } from 'react';
import { useAliases } from '../../../hooks';
import { aliasesService } from '../../../services';
import { Alias } from '../../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AliasDialog } from './AliasDialog';

interface DomainAliasesTabProps {
  domainId: number;
}

export const DomainAliasesTab: React.FC<DomainAliasesTabProps> = ({ domainId }) => {
  const { aliases, loading, loadAliases } = useAliases(domainId);
  const [selectedAlias, setSelectedAlias] = useState<Alias | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedAlias(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (alias: Alias) => {
    setSelectedAlias(alias);
    setIsDialogOpen(true);
  };

  const handleDelete = async (alias: Alias) => {
    if (!confirm(`Czy na pewno chcesz usunąć alias ${alias.name}?`)) return;

    try {
      await aliasesService.delete(domainId, alias.id);
      toast.success('Alias został usunięty');
      await loadAliases();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas usuwania aliasu');
    }
  };

  const handleSave = async () => {
    await loadAliases();
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
            <CardTitle>Aliasy</CardTitle>
            <CardDescription>Adresy przekierowujące do innych skrzynek</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Dodaj alias
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {aliases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak aliasów
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adres źródłowy</TableHead>
                <TableHead>Przekierowanie do</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data utworzenia</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aliases.map((alias) => (
                <TableRow key={alias.id}>
                  <TableCell>{alias.name}</TableCell>
                  <TableCell>{alias.to}</TableCell>
                  <TableCell>
                    <Badge variant={alias.active ? 'default' : 'secondary'}>
                      {alias.active ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(alias.created_at).toLocaleString('pl-PL')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(alias)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(alias)}
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

      <AliasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        domainId={domainId}
        alias={selectedAlias}
        onSave={handleSave}
      />
    </Card>
  );
};
