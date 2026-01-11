import React, { useState } from 'react';
import { useDomains } from '../../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, ChevronRight } from 'lucide-react';
import { DomainDialog } from './DomainDialog';
import { DomainDetailView } from './DomainDetailView';
import { Domain } from '../../../types';

export const DomainsTab: React.FC = () => {
  const { user } = useAuth();
  const { domains, loading, loadDomains } = useDomains();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingDomain, setViewingDomain] = useState<Domain | null>(null);

  const isAdmin = user?.role === 'administrator';

  const handleCreate = () => {
    setSelectedDomain(null);
    setIsDialogOpen(true);
  };

  const handleViewDomain = (domain: Domain) => {
    setViewingDomain(domain);
  };

  const handleBackToList = () => {
    setViewingDomain(null);
    loadDomains();
  };

  const handleSave = async () => {
    await loadDomains();
    setIsDialogOpen(false);
  };

  if (viewingDomain) {
    return <DomainDetailView domain={viewingDomain} onBack={handleBackToList} />;
  }

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
            <CardTitle>Domeny</CardTitle>
            <CardDescription>
              {isAdmin ? 'Zarządzaj wszystkimi domenami' : 'Zarządzaj przypisanymi domenami'}
            </CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj domenę
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {domains.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Brak domen
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa domeny</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data utworzenia</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewDomain(domain)}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>
                    <Badge variant={domain.active ? 'default' : 'secondary'}>
                      {domain.active ? 'Aktywna' : 'Nieaktywna'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(domain.created_at).toLocaleString('pl-PL')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDomain(domain);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <DomainDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        domain={selectedDomain}
        onSave={handleSave}
      />
    </Card>
  );
};
