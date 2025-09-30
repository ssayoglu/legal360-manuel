import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLegalProcess } from '../hooks/useApi';
import { legalProcesses } from '../data/mock';

// Test individual imports
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Home, 
  Briefcase, 
  Scale, 
  Clock, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Calculator, 
  DollarSign 
} from 'lucide-react';
import Header from './Header';
import CostBreakdown from './CostBreakdown';
import AdBanner from './AdBanner';

const ProcessFlowWithHeaderDebug = () => {
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
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
            <p className="text-gray-600 mb-4">Hukuki süreç yüklenirken bir hata oluştu.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
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
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Süreç Bulunamadı</h2>
            <p className="text-gray-600 mb-4">Aradığınız hukuki süreç bulunamadı.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const iconMap = {
    Heart: Heart,
    Home: Home,
    Briefcase: Briefcase,
    Scale: Scale,
    DollarSign: DollarSign,
    Baby: Users,
    Car: Scale
  };

  const IconComponent = iconMap[currentProcess.icon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentProcess.title}
              </h1>
              <p className="text-white/80">{currentProcess.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Debug Test</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">UI Components Test:</h3>
                <div className="flex gap-2 mt-2">
                  <Button>Test Button</Button>
                  <Badge>Test Badge</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Card Test:</h3>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Test Card</CardTitle>
                    <CardDescription>Test description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Test content</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold">Icons Test:</h3>
                <div className="flex gap-2 mt-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <Home className="h-6 w-6 text-blue-500" />
                  <Briefcase className="h-6 w-6 text-green-500" />
                  <Scale className="h-6 w-6 text-purple-500" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Custom Components Test:</h3>
                <div className="mt-2">
                  <p>Header: {typeof Header}</p>
                  <p>CostBreakdown: {typeof CostBreakdown}</p>
                  <p>AdBanner: {typeof AdBanner}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Process Data:</h3>
                <div className="mt-2">
                  <p>Title: {currentProcess.title}</p>
                  <p>Icon: {currentProcess.icon}</p>
                  <p>IconComponent: {typeof IconComponent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowWithHeaderDebug;
