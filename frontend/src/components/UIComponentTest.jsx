import React from 'react';
import { useParams } from 'react-router-dom';
import { useLegalProcess } from '../hooks/useApi';
import { legalProcesses } from '../data/mock';

// Test UI components one by one
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const UIComponentTest = () => {
  const { id } = useParams();
  const { data: process, loading, error } = useLegalProcess(id);

  // Mock data fallback
  const mockProcess = legalProcesses.find(p => p.id === id);
  const currentProcess = process || mockProcess;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Hukuki süreç yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentProcess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
            <p className="text-gray-600 mb-4">Hukuki süreç yüklenirken bir hata oluştu.</p>
            <button onClick={() => window.history.back()}>
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProcess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Süreç Bulunamadı</h2>
            <p className="text-gray-600 mb-4">Aradığınız hukuki süreç bulunamadı.</p>
            <button onClick={() => window.history.back()}>
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">UI Component Test</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">UI Component Types:</h2>
                <p>Button: {typeof Button}</p>
                <p>Card: {typeof Card}</p>
                <p>CardHeader: {typeof CardHeader}</p>
                <p>CardTitle: {typeof CardTitle}</p>
                <p>CardDescription: {typeof CardDescription}</p>
                <p>CardContent: {typeof CardContent}</p>
                <p>Badge: {typeof Badge}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Button Test:</h2>
                <div className="flex gap-2">
                  <Button>Default Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Card Test:</h2>
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Test Card</CardTitle>
                    <CardDescription>This is a test card description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the card content area.</p>
                    <div className="mt-2">
                      <Badge>Test Badge</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Process Data:</h2>
                <p>Title: {currentProcess.title}</p>
                <p>Description: {currentProcess.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIComponentTest;
