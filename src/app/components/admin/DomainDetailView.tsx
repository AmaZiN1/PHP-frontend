import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { domainsService } from '../../../services';
import { Domain } from '../../../types';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ArrowLeft, Users, AtSign, Mail, FileText, Edit, Trash2 } from 'lucide-react';
import { DomainDialog } from './DomainDialog';
import { DomainManagersTab } from './DomainManagersTab';
import { DomainAliasesTab } from './DomainAliasesTab';
import { DomainMailboxesTab } from './DomainMailboxesTab';
import { DomainLogsTab } from './DomainLogsTab';
import { toast } from 'sonner';

interface DomainDetailViewProps {
  domain: Domain;
  onBack: () => void;
}

export const DomainDetailView: React.FC<DomainDetailViewProps> = ({ domain, onBack }) => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(domain);

  const isAdmin = user?.role === 'administrator';

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm(`Czy na pewno chcesz usunąć domenę ${domain.name}? Ta operacja usunie wszystkie mailboxy i aliasy.`)) {
      return;
    }

    try {
      await domainsService.delete(domain.id);
      toast.success('Domena została usunięta');
      onBack();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas usuwania domeny');
    }
  };

  const handleSave = () => {
    setIsEditDialogOpen(false);
    // Reload domain data if needed
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pt-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {domain.name}
                  <Badge variant={domain.active ? 'default' : 'secondary'}>
                    {domain.active ? 'Aktywna' : 'Nieaktywna'}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Utworzono: {new Date(domain.created_at).toLocaleString('pl-PL')}
                </p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edytuj
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Usuń
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mailboxes">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: isAdmin ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }}>
          {isAdmin && (
            <TabsTrigger value="managers">
              <Users className="h-4 w-4 mr-2" />
              Zarządcy
            </TabsTrigger>
          )}
          <TabsTrigger value="aliases">
            <AtSign className="h-4 w-4 mr-2" />
            Aliasy
          </TabsTrigger>
          <TabsTrigger value="mailboxes">
            <Mail className="h-4 w-4 mr-2" />
            Skrzynki pocztowe
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Logi
          </TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="managers">
            <DomainManagersTab domainId={domain.id} />
          </TabsContent>
        )}

        <TabsContent value="aliases">
          <DomainAliasesTab domainId={domain.id} />
        </TabsContent>

        <TabsContent value="mailboxes">
          <DomainMailboxesTab domainId={domain.id} domainName={domain.name} />
        </TabsContent>

        <TabsContent value="logs">
          <DomainLogsTab domainId={domain.id} domainName={domain.name} />
        </TabsContent>
      </Tabs>

      <DomainDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        domain={currentDomain}
        onSave={handleSave}
      />
    </div>
  );
};
