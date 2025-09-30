import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calculator, Scale } from 'lucide-react';

const SentenceCalculatorSimple = ({ onClose }) => {
  const [inputs, setInputs] = useState({
    sentenceYears: '',
    hasGoodBehavior: true
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSentence = () => {
    const years = parseInt(inputs.sentenceYears) || 0;
    const totalDays = years * 365;

    if (totalDays <= 0) return;

    let remainingDays = totalDays;

    if (inputs.hasGoodBehavior) {
      const discount = Math.floor(totalDays * 0.33);
      remainingDays -= discount;
    }

    const formatDuration = (days) => {
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;
      
      let result = [];
      if (years > 0) result.push(`${years} yıl`);
      if (months > 0) result.push(`${months} ay`);
      if (remainingDays > 0) result.push(`${remainingDays} gün`);
      
      return result.join(' ') || '0 gün';
    };

    setResults({
      totalDays,
      remainingDays,
      formatDuration
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <Card className="border-0">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Scale className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">İnfaz Hesaplama</CardTitle>
                  <CardDescription className="text-red-100">
                    Basit infaz süresi hesaplaması
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
              <Label htmlFor="sentenceYears">Hapis Cezası (Yıl)</Label>
              <Input
                id="sentenceYears"
                type="number"
                placeholder="0"
                value={inputs.sentenceYears}
                onChange={(e) => handleInputChange('sentenceYears', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasGoodBehavior"
                checked={inputs.hasGoodBehavior}
                onChange={(e) => handleInputChange('hasGoodBehavior', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="hasGoodBehavior">İyi hal indirimi uygulanabilir</Label>
            </div>

            <Button
              onClick={calculateSentence}
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={!inputs.sentenceYears}
            >
              <Calculator className="h-4 w-4 mr-2" />
              İnfaz Süresini Hesapla
            </Button>

            {results && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Sonuç</h3>
                <p className="text-2xl font-bold text-red-600">
                  {results.formatDuration(results.remainingDays)}
                </p>
                <p className="text-sm text-gray-500">Tahmini İnfaz Süresi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentenceCalculatorSimple;