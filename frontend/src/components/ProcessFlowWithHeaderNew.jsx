import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLegalProcess } from '../hooks/useApi';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, Home, Briefcase, Scale, Clock, Users, FileText, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Calculator, DollarSign } from 'lucide-react';
import Header from './Header';

const ProcessFlowWithHeaderNew = () => {
  const { id } = useParams();
  const { data: process, loading, error } = useLegalProcess(id);
  const [selectedStep, setSelectedStep] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'step'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Hukuki süreç yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Scale className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Süreç Bulunamadı
            </h3>
            <p className="text-gray-600 mb-4">
              Aradığınız hukuki süreç bulunamadı. Süreç listesine dönebilirsiniz.
            </p>
            <Button onClick={() => window.history.back()} variant="outline">
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

  const IconComponent = iconMap[process.icon];

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setViewMode('step');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedStep(null);
  };

  const getCurrentStepIndex = () => {
    return selectedStep ? process.steps.findIndex(s => s.id === selectedStep.id) : -1;
  };

  const navigateToStep = (direction) => {
    const currentIndex = getCurrentStepIndex();
    let newIndex;
    
    if (direction === 'next' && currentIndex < process.steps.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }
    
    setSelectedStep(process.steps[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Process Header */}
      <section className={`py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${process.gradient || 'from-blue-500 to-blue-600'} text-white`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <span className="text-2xl">{process.icon === 'Heart' ? '💔' : '⚖️'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {process.title}
              </h1>
              <p className="text-white/80">
                {process.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Process Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Süreç Özeti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">{process.steps?.length || 0}</div>
                <div className="text-sm text-gray-500">Toplam Adım</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{process.duration || 'Belirsiz'}</div>
                <div className="text-sm text-gray-500">Tahmini Süre</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{process.difficulty || 'Orta'}</div>
                <div className="text-sm text-gray-500">Zorluk</div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Süreç Adımları</h2>
            <div className="space-y-4">
              {process.steps && process.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="p-4 rounded-lg border-2 bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.duration}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 ml-11">
                    <p className="text-sm text-gray-600">{step.description}</p>
                    
                    {step.participants && step.participants.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-700">Katılımcılar: </span>
                        <span className="text-xs text-gray-600">{step.participants.join(', ')}</span>
                      </div>
                    )}
                    
                    {step.required_documents && step.required_documents.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-700">Gerekli Belgeler:</span>
                        <ul className="mt-1 ml-4 text-xs text-gray-600">
                          {step.required_documents.map((doc, docIndex) => (
                            <li key={docIndex} className="list-disc">
                              {typeof doc === 'string' ? doc : doc.name || "Belge adı belirtilmemiş"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.important_notes && step.important_notes.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-orange-700">Önemli Noktalar:</span>
                        <ul className="mt-1 ml-4 text-xs text-orange-600">
                          {step.important_notes.map((note, noteIndex) => (
                            <li key={noteIndex} className="list-disc">
                              {typeof note === 'string' ? note : note.text || "Not belirtilmemiş"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowWithHeaderNew;