import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLegalProcess } from '../hooks/useApi';
import { legalProcesses } from '../data/mock';

const ProcessFlowWithHeaderDebug2 = () => {
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
            <h1 className="text-2xl font-bold mb-4">Debug Test - Basic HTML Only</h1>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Process Data:</h2>
                <p>Title: {currentProcess.title}</p>
                <p>Description: {currentProcess.description}</p>
                <p>Icon: {currentProcess.icon}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Import Tests:</h2>
                <p>useParams: {typeof useParams}</p>
                <p>useLegalProcess: {typeof useLegalProcess}</p>
                <p>legalProcesses: {Array.isArray(legalProcesses) ? 'Array' : typeof legalProcesses}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Next Step:</h2>
                <p>If you see this page without errors, the basic imports are working.</p>
                <p>We can then add UI components one by one to identify the problematic import.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowWithHeaderDebug2;
