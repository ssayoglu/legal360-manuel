import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert } from '../ui/alert';

const CodeEditor = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={6}
      className="w-full font-mono text-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      placeholder="<script>/* Google Ads code */</script>"
    />
  </div>
);

const AdsSettingsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState({
    is_active: false,
    horizontal_code: '',
    square_code: '',
    sidebar_code: '',
    mobile_code: '',
    infeed_code: '',
    head_code: '',
    body_top_code: '',
    body_bottom_code: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getAdminAdSettings();
      setSettings(data);
    } catch (e) {
      setError('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      // Send only fields allowed by backend AdSettingsUpdate
      const payload = {
        is_active: settings.is_active,
        horizontal_code: settings.horizontal_code,
        square_code: settings.square_code,
        sidebar_code: settings.sidebar_code,
        mobile_code: settings.mobile_code,
        infeed_code: settings.infeed_code,
        head_code: settings.head_code,
        body_top_code: settings.body_top_code,
        body_bottom_code: settings.body_bottom_code,
      };
      const updated = await apiService.updateAdminAdSettings(payload);
      setSettings(updated);
      setSuccess('Ayarlar kaydedildi');
      setEditing(false);
    } catch (e) {
      setError('Kaydetme sırasında hata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Reklam ayarları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reklam Ayarları</h1>
          <p className="text-gray-600">Google Ads kodlarını yönetin</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={saving}>
                Kaydet
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                İptal
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              Düzenle
            </Button>
          )}
        </div>
      </div>

      {error && <Alert variant="destructive">{error}</Alert>}
      {success && <Alert className="bg-green-50 border-green-200 text-green-700">{success}</Alert>}

      <Card>
        <CardHeader>
          <CardTitle>Genel</CardTitle>
          <CardDescription>Site genelinde reklam gösterimini aç/kapat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch
              checked={!!settings.is_active}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, is_active: v }))}
              disabled={!editing}
            />
            <span className="text-gray-700">Reklamlar aktif</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yerleşimler</CardTitle>
          <CardDescription>Banner yerleşimleri için Google Ads kodları</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="horizontal">
            <TabsList>
              <TabsTrigger value="horizontal">Yatay (728x90)</TabsTrigger>
              <TabsTrigger value="square">Kare (300x250)</TabsTrigger>
              <TabsTrigger value="sidebar">Yan (160x600)</TabsTrigger>
              <TabsTrigger value="mobile">Mobil (320x50)</TabsTrigger>
              <TabsTrigger value="infeed">Liste İçi (In-feed)</TabsTrigger>
            </TabsList>
            <TabsContent value="horizontal">
              <CodeEditor
                label="Horizontal Banner Kodu"
                value={settings.horizontal_code}
                onChange={(v) => setSettings((s) => ({ ...s, horizontal_code: v }))}
                disabled={!editing}
              />
            </TabsContent>
            <TabsContent value="square">
              <CodeEditor
                label="Square Banner Kodu"
                value={settings.square_code}
                onChange={(v) => setSettings((s) => ({ ...s, square_code: v }))}
                disabled={!editing}
              />
            </TabsContent>
            <TabsContent value="sidebar">
              <CodeEditor
                label="Sidebar Banner Kodu"
                value={settings.sidebar_code}
                onChange={(v) => setSettings((s) => ({ ...s, sidebar_code: v }))}
                disabled={!editing}
              />
            </TabsContent>
            <TabsContent value="mobile">
              <CodeEditor
                label="Mobil Banner Kodu"
                value={settings.mobile_code}
                onChange={(v) => setSettings((s) => ({ ...s, mobile_code: v }))}
                disabled={!editing}
              />
            </TabsContent>
            <TabsContent value="infeed">
              <CodeEditor
                label="Blog Liste İçi (In-feed) Reklam Kodu"
                value={settings.infeed_code}
                onChange={(v) => setSettings((s) => ({ ...s, infeed_code: v }))}
                disabled={!editing}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gelişmiş</CardTitle>
          <CardDescription>Opsiyonel: Head/Body alanlarına ek kodlar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeEditor
            label="<head> Kodu"
            value={settings.head_code}
            onChange={(v) => setSettings((s) => ({ ...s, head_code: v }))}
            disabled={!editing}
          />
          <CodeEditor
            label="<body> Üstü Kodu"
            value={settings.body_top_code}
            onChange={(v) => setSettings((s) => ({ ...s, body_top_code: v }))}
            disabled={!editing}
          />
          <CodeEditor
            label="</body> Öncesi Kodu"
            value={settings.body_bottom_code}
            onChange={(v) => setSettings((s) => ({ ...s, body_bottom_code: v }))}
            disabled={!editing}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsSettingsAdmin;


