import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Calculator, TrendingUp, Clock, DollarSign, FileText, AlertCircle } from 'lucide-react';

const calculatorConfigs = {
  compensation: {
    title: 'Tazminat Hesaplama Aracı',
    description: 'İş Kanunu\'na göre kıdem, ihbar ve diğer tazminatları hesaplayın',
    parameters: {
      minimumWage: { value: 17002, label: 'Asgari Ücret (2024)', unit: 'TL' },
      severanceMultiplier: { value: 30, label: 'Kıdem Tazminatı Çarpanı', unit: 'gün' },
      noticeMultiplier: { value: 15, label: 'İhbar Tazminatı Çarpanı', unit: 'gün' },
      overtimeRate: { value: 1.5, label: 'Fazla Mesai Çarpanı', unit: 'kat' },
      maxSeveranceCap: { value: 26061.86, label: 'Kıdem Tazminatı Tavanı', unit: 'TL' }
    }
  }
};

const CompensationCalculator = ({ onClose }) => {
  const [inputs, setInputs] = useState({
    monthlyWage: '',
    workYears: '',
    workMonths: '',
    overtimeHours: '',
    usedVacationDays: '',
    terminationType: 'employer' // 'employer', 'employee', 'mutual'
  });

  const [results, setResults] = useState(null);
  const config = calculatorConfigs.compensation;

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateCompensation = () => {
    const monthlyWage = parseFloat(inputs.monthlyWage) || 0;
    const totalYears = parseFloat(inputs.workYears) || 0;
    const totalMonths = parseFloat(inputs.workMonths) || 0;
    const overtimeHours = parseFloat(inputs.overtimeHours) || 0;
    const usedVacation = parseFloat(inputs.usedVacationDays) || 0;

    // Günlük ücret hesabı
    const dailyWage = monthlyWage / 30;
    const totalWorkDays = (totalYears * 365) + (totalMonths * 30);

    // Kıdem tazminatı (1 yıldan fazla çalışma durumunda)
    let severancePay = 0;
    if (totalYears >= 1) {
      severancePay = Math.min(
        totalYears * config.parameters.severanceMultiplier.value * dailyWage,
        config.parameters.maxSeveranceCap.value
      );
    }

    // İhbar tazminatı (haksız fesih durumunda)
    let noticePay = 0;
    if (inputs.terminationType === 'employer' && totalYears >= 0.5) {
      if (totalYears < 1.5) {
        noticePay = 15 * dailyWage; // 2 hafta
      } else if (totalYears < 3) {
        noticePay = 30 * dailyWage; // 4 hafta  
      } else {
        noticePay = 45 * dailyWage; // 6 hafta
      }
    }

    // Fazla mesai ücreti
    const overtimePay = overtimeHours * (monthlyWage / 225) * config.parameters.overtimeRate.value;

    // Kullanılmayan yıllık izin
    const annualVacationDays = Math.floor(totalYears) * 20; // Yılda 20 gün
    const unusedVacationDays = Math.max(0, annualVacationDays - usedVacation);
    const vacationPay = unusedVacationDays * dailyWage;

    // Toplam hesaplama
    const totalCompensation = severancePay + noticePay + overtimePay + vacationPay;

    setResults({
      severancePay,
      noticePay,
      overtimePay,
      vacationPay,
      totalCompensation,
      dailyWage,
      unusedVacationDays
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                  <CardDescription className="text-orange-100">
                    {config.description}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyWage">Aylık Brüt Maaş (TL)</Label>
                <Input
                  id="monthlyWage"
                  type="number"
                  placeholder="örn: 15000"
                  value={inputs.monthlyWage}
                  onChange={(e) => handleInputChange('monthlyWage', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="workYears">Çalışma Süresi (Yıl)</Label>
                <Input
                  id="workYears"
                  type="number"
                  placeholder="örn: 3"
                  value={inputs.workYears}
                  onChange={(e) => handleInputChange('workYears', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="workMonths">Ek Çalışma (Ay)</Label>
                <Input
                  id="workMonths"
                  type="number"
                  placeholder="örn: 6"
                  value={inputs.workMonths}
                  onChange={(e) => handleInputChange('workMonths', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="overtimeHours">Fazla Mesai (Saat)</Label>
                <Input
                  id="overtimeHours"
                  type="number"
                  placeholder="örn: 100"
                  value={inputs.overtimeHours}
                  onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="usedVacationDays">Kullanılan İzin (Gün)</Label>
                <Input
                  id="usedVacationDays"
                  type="number"
                  placeholder="örn: 40"
                  value={inputs.usedVacationDays}
                  onChange={(e) => handleInputChange('usedVacationDays', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="terminationType">Fesih Türü</Label>
                <select
                  id="terminationType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={inputs.terminationType}
                  onChange={(e) => handleInputChange('terminationType', e.target.value)}
                >
                  <option value="employer">İşveren Feshi</option>
                  <option value="employee">İşçi Feshi</option>
                  <option value="mutual">Karşılıklı Anlaşma</option>
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateCompensation}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={!inputs.monthlyWage || !inputs.workYears}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Hesapla
            </Button>

            {/* Results */}
            {results && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Hesaplama Sonuçları
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Kıdem Tazminatı</p>
                          <p className="text-lg font-bold text-orange-600">
                            ₺{results.severancePay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">İhbar Tazminatı</p>
                          <p className="text-lg font-bold text-blue-600">
                            ₺{results.noticePay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Fazla Mesai</p>
                          <p className="text-lg font-bold text-green-600">
                            ₺{results.overtimePay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Yıllık İzin</p>
                          <p className="text-lg font-bold text-purple-600">
                            ₺{results.vacationPay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {results.unusedVacationDays} gün
                          </p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-300">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-lg text-gray-700 mb-2">Toplam Alacak</p>
                      <p className="text-3xl font-bold text-orange-600">
                        ₺{results.totalCompensation.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        Günlük ücret: ₺{results.dailyWage.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Önemli Uyarı</p>
                      <p>
                        Bu hesaplama İş Kanunu hükümlerine göre yapılmış tahmini bir hesaplamadır. 
                        Kesin tutarlar için mutlaka bir hukuk uzmanına danışınız.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationCalculator;