import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLegalProcess } from '../hooks/useApi';
import { legalProcesses } from '../data/mock';
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
import CompensationCalculator from './CompensationCalculator';
import SentenceCalculator from './SentenceCalculator';

const ProcessFlowWithHeader = () => {
  const { id } = useParams();
  const { data: process, loading, error } = useLegalProcess(id);
  const [selectedStep, setSelectedStep] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'step'
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  // Mock data fallback
  const mockProcess = legalProcesses.find(p => p.id === id);
  const currentProcess = process || mockProcess;

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

  if (error && !currentProcess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
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

  const IconComponent = iconMap[currentProcess.icon] || Scale;

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setViewMode('step');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedStep(null);
  };

  const getCurrentStepIndex = () => {
    return selectedStep ? (currentProcess.steps || []).findIndex(s => s.id === selectedStep.id) : -1;
  };

  const navigateToStep = (direction) => {
    const currentIndex = getCurrentStepIndex();
    const steps = currentProcess.steps || [];
    let newIndex;
    
    if (direction === 'next' && currentIndex < steps.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }
    
    setSelectedStep(steps[newIndex]);
  };

  const renderCalculator = () => {
    if (!showCalculator) return null;

    if (currentProcess.calculatorType === 'compensation') {
      return <CompensationCalculator onClose={() => setShowCalculator(false)} />;
    } else if (currentProcess.calculatorType === 'sentence') {
      return <SentenceCalculator onClose={() => setShowCalculator(false)} />;
    }

    // Fallback for unknown calculator types
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Hesaplama Aracı</h3>
          <p className="text-gray-600">Bu süreç için hesaplama aracı mevcut değil.</p>
          <button
            onClick={() => setShowCalculator(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Process Header */}
      <section className={`py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${currentProcess.gradient} text-white`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {viewMode === 'step' && selectedStep ? selectedStep.title : currentProcess.title}
              </h1>
              <p className="text-white/80">
                {viewMode === 'step' ? `Adım ${getCurrentStepIndex() + 1}` : currentProcess.description}
              </p>
            </div>
          </div>
          
          {viewMode === 'step' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToOverview}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Genel Bakışa Dön
            </Button>
          )}
        </div>
      </section>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {viewMode === 'overview' ? (
            // Overview Mode
            <>
              {/* Process Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-xl">Süreç Özeti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{(currentProcess.steps || []).length}</div>
                          <div className="text-sm text-gray-500">Toplam Adım</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{currentProcess.duration}</div>
                          <div className="text-sm text-gray-500">Tahmini Süre</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{currentProcess.difficulty}</div>
                          <div className="text-sm text-gray-500">Zorluk</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {currentProcess.hasCalculator && (
                      <Button
                        onClick={() => setShowCalculator(true)}
                        className={`bg-gradient-to-r ${currentProcess.gradient} hover:opacity-90 text-white`}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        {currentProcess.calculatorType === 'compensation' ? 'Tazminat Hesapla' : 'İnfaz Süresi Hesapla'}
                      </Button>
                    )}

                    {currentProcess.estimatedCosts && (
                      <Button
                        onClick={() => setShowCostBreakdown(true)}
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Masraf Detayları
                      </Button>
                    )}
                  </div>

                  {/* Process Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">İnteraktif Süreç Haritası</CardTitle>
                      <CardDescription>Adımlara tıklayarak detayları görüntüleyin</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(currentProcess.steps || []).map((step, index) => (
                          <div
                            key={step.id}
                            className="p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95"
                            onClick={() => handleStepClick(step)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-600">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-semibold">{step.title}</div>
                                  <div className="text-xs text-gray-500">{step.duration}</div>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <AdBanner type="sidebar" />
                </div>
              </div>
            </>
          ) : (
            // Step Detail Mode
            selectedStep && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  {/* Step Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToStep('prev')}
                      disabled={getCurrentStepIndex() === 0}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Önceki
                    </Button>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Adım {getCurrentStepIndex() + 1} / {(currentProcess.steps || []).length}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToStep('next')}
                      disabled={getCurrentStepIndex() === (currentProcess.steps || []).length - 1}
                      className="flex items-center"
                    >
                      Sonraki
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Main Step Info */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-blue-600">
                          {selectedStep.title}
                        </CardTitle>
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {selectedStep.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-800">Süre</span>
                          </div>
                          <span className="text-blue-700">{selectedStep.duration}</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Users className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">Katılımcılar</span>
                          </div>
                          <span className="text-sm text-green-700">
                            {selectedStep.participants.join(', ')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Required Documents */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Gerekli Belgeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(selectedStep.required_documents || []).map((doc, index) => (
                          <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 leading-relaxed">
                                {typeof doc === 'string' ? doc : doc.name || JSON.stringify(doc)}
                              </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                        Önemli Noktalar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(selectedStep.important_notes || []).map((note, index) => (
                          <div key={index} className="flex items-start p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-orange-800 leading-relaxed">
                              {typeof note === 'string' ? note : note.text || JSON.stringify(note)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  {selectedStep.connections.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Sonraki Olası Adımlar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {(selectedStep.connections || []).map((connectionId) => {
                            const connectedStep = (currentProcess.steps || []).find(s => s.id === connectionId);
                            return (
                              <Button
                                key={connectionId}
                                variant="ghost"
                                className="w-full justify-start text-left h-auto p-3 bg-gray-50 hover:bg-blue-50"
                                onClick={() => setSelectedStep(connectedStep)}
                              >
                                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{connectedStep?.title}</div>
                                  <div className="text-xs text-gray-500">{connectedStep?.duration}</div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <AdBanner type="sidebar" />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Calculator Modal */}
      {renderCalculator()}

      {/* Cost Breakdown Modal */}
      {showCostBreakdown && (
        <CostBreakdown 
          process={currentProcess} 
          onClose={() => setShowCostBreakdown(false)} 
        />
      )}
    </div>
  );
};

export default ProcessFlowWithHeader;