import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Users, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { UsersTab } from './admin/UsersTab';
import { DomainsTab } from './admin/DomainsTab';
import { GlobalLogsTab } from './admin/GlobalLogsTab';

export const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('domains');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Wylogowano pomyślnie');
    } catch (error) {
      toast.error('Błąd podczas wylogowywania');
    }
  };

  const isAdmin = user?.role === 'administrator';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Panel zarządzania pocztą</h1>
              <p className="text-sm text-gray-500 mt-1">
                {user?.email} ({user?.role === 'administrator' ? 'Administrator' : 'Zarządca domen'})
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: isAdmin ? 'repeat(3, 1fr)' : '1fr' }}>
            {isAdmin && (
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Użytkownicy
              </TabsTrigger>
            )}
            <TabsTrigger value="domains">
              <Globe className="h-4 w-4 mr-2" />
              Domeny
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="global-logs">
                <FileText className="h-4 w-4 mr-2" />
                Logi globalne
              </TabsTrigger>
            )}
          </TabsList>

          {isAdmin && (
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
          )}

          <TabsContent value="domains">
            <DomainsTab />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="global-logs">
              <GlobalLogsTab />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};
