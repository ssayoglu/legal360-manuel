import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calculator } from 'lucide-react';

const CompensationCalculatorSimple = ({ onClose }) => {
  const [inputs, setInputs] = useState({
    monthlyWage: '',
    workYears: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateCompensation = () => {
    const monthlyWage = parseFloat(inputs.monthlyWage) || 0;
    const totalYears = parseFloat(inputs.workYears) || 0;
    
    const dailyWage = monthlyWage / 30;
    let severancePay = 0;
    
    if (totalYears >= 1) {
      severancePay = totalYears * 30 * dailyWage;
    }

    setResults({
      severancePay,
      dailyWage
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <Card className="border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">Tazminat Hesaplama</CardTitle>
                  <CardDescription className="text-orange-100">
                    Basit tazminat hesaplaması
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

          <CardContent className="p-6 space-y-4">
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

            <Button
              onClick={calculateCompensation}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={!inputs.monthlyWage || !inputs.workYears}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Hesapla
            </Button>

            {results && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Sonuç</h3>
                <p className="text-2xl font-bold text-orange-600">
                  ₺{results.severancePay.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Tahmini Kıdem Tazminatı</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationCalculatorSimple;