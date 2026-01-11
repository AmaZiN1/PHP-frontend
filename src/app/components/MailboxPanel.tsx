import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mailboxProfileService } from '../../services';
import { Autoresponder } from '../../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { LogOut, User, FileText, Bot, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const MailboxPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [footerText, setFooterText] = useState('');
  const [footerLoading, setFooterLoading] = useState(false);

  const [autoresponder, setAutoresponder] = useState<Autoresponder | null>(null);
  const [autoresponderActive, setAutoresponderActive] = useState(false);
  const [autoresponderSubject, setAutoresponderSubject] = useState('');
  const [autoresponderBody, setAutoresponderBody] = useState('');
  const [autoresponderStartDate, setAutoresponderStartDate] = useState('');
  const [autoresponderEndDate, setAutoresponderEndDate] = useState('');
  const [autoresponderLoading, setAutoresponderLoading] = useState(false);

  useEffect(() => {
    loadFooter();
    loadAutoresponder();
  }, []);

  const loadFooter = async () => {
    try {
      const data = await mailboxProfileService.getFooter();
      setFooterText(data.footer_text || '');
    } catch (error) {
      console.error('Failed to load footer:', error);
    }
  };

  const loadAutoresponder = async () => {
    try {
      const data = await mailboxProfileService.getAutoresponder();
      if (data.autoresponder) {
        setAutoresponder(data.autoresponder);
        setAutoresponderActive(data.autoresponder.active);
        setAutoresponderSubject(data.autoresponder.subject);
        setAutoresponderBody(data.autoresponder.body);
        setAutoresponderStartDate(data.autoresponder.start_date ? data.autoresponder.start_date.slice(0, 16) : '');
        setAutoresponderEndDate(data.autoresponder.end_date ? data.autoresponder.end_date.slice(0, 16) : '');
      }
    } catch (error) {
      console.error('Failed to load autoresponder:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Wylogowano pomyślnie');
    } catch (error) {
      toast.error('Błąd podczas wylogowywania');
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Nowe hasła nie pasują do siebie');
      return;
    }

    setLoading(true);
    try {
      await mailboxProfileService.changePassword(currentPassword, newPassword);
      toast.success('Hasło zostało zmienione');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas zmiany hasła');
    } finally {
      setLoading(false);
    }
  };

  const handleFooterUpdate = async () => {
    setFooterLoading(true);
    try {
      await mailboxProfileService.updateFooter(footerText || null);
      toast.success('Footer został zaktualizowany');
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas aktualizacji footera');
    } finally {
      setFooterLoading(false);
    }
  };

  const handleAutoresponderUpdate = async () => {
    if (!autoresponderSubject || !autoresponderBody) {
      toast.error('Wypełnij temat i treść automatycznej odpowiedzi');
      return;
    }

    setAutoresponderLoading(true);
    try {
      await mailboxProfileService.updateAutoresponder({
        subject: autoresponderSubject,
        body: autoresponderBody,
        active: autoresponderActive,
        start_date: autoresponderStartDate || null,
        end_date: autoresponderEndDate || null,
      });
      toast.success('Automatyczna odpowiedź została zaktualizowana');
      await loadAutoresponder();
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas aktualizacji automatycznej odpowiedzi');
    } finally {
      setAutoresponderLoading(false);
    }
  };

  const handleAutoresponderDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć automatyczną odpowiedź?')) return;

    setAutoresponderLoading(true);
    try {
      await mailboxProfileService.deleteAutoresponder();
      toast.success('Automatyczna odpowiedź została usunięta');
      setAutoresponder(null);
      setAutoresponderActive(false);
      setAutoresponderSubject('');
      setAutoresponderBody('');
      setAutoresponderStartDate('');
      setAutoresponderEndDate('');
    } catch (error: any) {
      toast.error(error.message || 'Błąd podczas usuwania automatycznej odpowiedzi');
    } finally {
      setAutoresponderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Panel skrzynki pocztowej</h1>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Zmiana hasła
            </CardTitle>
            <CardDescription>
              Zmień swoje hasło dostępowe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Obecne hasło</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nowe hasło</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Potwierdź nowe hasło</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Zmiana...' : 'Zmień hasło'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Footer wiadomości
            </CardTitle>
            <CardDescription>
              Tekst dodawany automatycznie na końcu Twoich wiadomości
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer">Footer (opcjonalny)</Label>
              <Textarea
                id="footer"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Pozdrawiam,&#10;Jan Kowalski"
                rows={5}
                disabled={footerLoading}
              />
            </div>

            <Button onClick={handleFooterUpdate} disabled={footerLoading}>
              {footerLoading ? 'Zapisywanie...' : 'Zapisz footer'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Automatyczna odpowiedź
            </CardTitle>
            <CardDescription>
              Automatyczna odpowiedź na przychodzące wiadomości
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoresponder-active">Aktywny</Label>
              <Switch
                id="autoresponder-active"
                checked={autoresponderActive}
                onCheckedChange={setAutoresponderActive}
                disabled={autoresponderLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoresponder-subject">Temat</Label>
              <Input
                id="autoresponder-subject"
                value={autoresponderSubject}
                onChange={(e) => setAutoresponderSubject(e.target.value)}
                placeholder="Urlop"
                disabled={autoresponderLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoresponder-body">Treść</Label>
              <Textarea
                id="autoresponder-body"
                value={autoresponderBody}
                onChange={(e) => setAutoresponderBody(e.target.value)}
                placeholder="Jestem na urlopie do..."
                rows={5}
                disabled={autoresponderLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data rozpoczęcia (opcjonalna)</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={autoresponderStartDate}
                  onChange={(e) => setAutoresponderStartDate(e.target.value)}
                  disabled={autoresponderLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Data zakończenia (opcjonalna)</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={autoresponderEndDate}
                  onChange={(e) => setAutoresponderEndDate(e.target.value)}
                  disabled={autoresponderLoading}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAutoresponderUpdate} disabled={autoresponderLoading}>
                {autoresponderLoading ? 'Zapisywanie...' : autoresponder ? 'Aktualizuj automatyczną odpowiedź' : 'Utwórz automatyczną odpowiedź'}
              </Button>
              {autoresponder && (
                <Button onClick={handleAutoresponderDelete} variant="destructive" disabled={autoresponderLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Usuń
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
