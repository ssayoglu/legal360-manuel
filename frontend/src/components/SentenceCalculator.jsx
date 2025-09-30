import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Calculator, Scale, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const calculatorConfigs = {
  sentence: {
    title: 'İnfaz Hesaplama Aracı',
    description: 'Hapis cezasının infaz süresini hesaplayın',
    parameters: {
      goodBehaviorDiscount: { value: 0.33, label: 'İyi Hal İndirimi', unit: '%' },
      openPrisonRate: { value: 0.5, label: 'Açık Cezaevi Şartı', unit: '%' },
      homeDetentionRate: { value: 0.25, label: 'Ev Hapsi Şartı', unit: '%' },
      electronicTagRate: { value: 0.33, label: 'Elektronik Kelepçe Şartı', unit: '%' }
    }
  }
};

const SentenceCalculator = ({ onClose }) => {
  const [inputs, setInputs] = useState({
    sentenceYears: '',
    sentenceMonths: '',
    sentenceDays: '',
    crimeType: 'general', // 'general', 'terror', 'sexual'
    hasGoodBehavior: true,
    wantsOpenPrison: false,
    wantsHomeDetention: false,
    wantsElectronicTag: false
  });

  const [results, setResults] = useState(null);
  const config = calculatorConfigs.sentence;

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSentence = () => {
    const years = parseInt(inputs.sentenceYears) || 0;
    const months = parseInt(inputs.sentenceMonths) || 0;
    const days = parseInt(inputs.sentenceDays) || 0;

    // Toplam gün hesabı
    const totalDays = (years * 365) + (months * 30) + days;

    if (totalDays <= 0) return;

    let remainingDays = totalDays;
    let calculations = [];

    // İyi hal indirimi
    if (inputs.hasGoodBehavior) {
      const discount = Math.floor(totalDays * config.parameters.goodBehaviorDiscount.value);
      remainingDays -= discount;
      calculations.push({
        type: 'İyi Hal İndirimi',
        days: discount,
        remaining: remainingDays,
        color: 'text-green-600'
      });
    }

    // Açık cezaevi
    let openPrisonDays = 0;
    if (inputs.wantsOpenPrison && remainingDays > 365) {
      openPrisonDays = Math.floor(remainingDays * config.parameters.openPrisonRate.value);
      calculations.push({
        type: 'Açık Cezaevi',
        days: openPrisonDays,
        remaining: remainingDays - openPrisonDays,
        color: 'text-blue-600'
      });
    }

    // Ev hapsi
    let homeDetentionDays = 0;
    if (inputs.wantsHomeDetention) {
      const eligibleDays = remainingDays - openPrisonDays;
      homeDetentionDays = Math.floor(eligibleDays * config.parameters.homeDetentionRate.value);
      calculations.push({
        type: 'Ev Hapsi',
        days: homeDetentionDays,  
        remaining: eligibleDays - homeDetentionDays,
        color: 'text-purple-600'
      });
    }

    // Elektronik kelepçe
    let electronicTagDays = 0;
    if (inputs.wantsElectronicTag) {
      const eligibleDays = remainingDays - openPrisonDays - homeDetentionDays;
      electronicTagDays = Math.floor(eligibleDays * config.parameters.electronicTagRate.value);
      calculations.push({
        type: 'Elektronik Kelepçe',
        days: electronicTagDays,
        remaining: eligibleDays - electronicTagDays,
        color: 'text-orange-600'
      });
    }

    // Kalan cezaevi süresi
    const prisonDays = remainingDays - openPrisonDays - homeDetentionDays - electronicTagDays;

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
      prisonDays,
      openPrisonDays,
      homeDetentionDays,
      electronicTagDays,
      calculations,
      formatDuration
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Scale className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                  <CardDescription className="text-red-100">
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
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sentenceYears">Yıl</Label>
                  <Input
                    id="sentenceYears"
                    type="number"
                    placeholder="0"
                    value={inputs.sentenceYears}
                    onChange={(e) => handleInputChange('sentenceYears', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sentenceMonths">Ay</Label>
                  <Input
                    id="sentenceMonths"
                    type="number"
                    placeholder="0"
                    value={inputs.sentenceMonths}
                    onChange={(e) => handleInputChange('sentenceMonths', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="sentenceDays">Gün</Label>
                  <Input
                    id="sentenceDays"
                    type="number"
                    placeholder="0"
                    value={inputs.sentenceDays}
                    onChange={(e) => handleInputChange('sentenceDays', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="crimeType">Suç Türü</Label>
                <select
                  id="crimeType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={inputs.crimeType}
                  onChange={(e) => handleInputChange('crimeType', e.target.value)}
                >
                  <option value="general">Genel Suçlar</option>
                  <option value="terror">Terör Suçları</option>
                  <option value="sexual">Cinsel Suçlar</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="wantsOpenPrison"
                    checked={inputs.wantsOpenPrison}
                    onChange={(e) => handleInputChange('wantsOpenPrison', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="wantsOpenPrison">Açık cezaevi şartları uygun</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="wantsHomeDetention"
                    checked={inputs.wantsHomeDetention}
                    onChange={(e) => handleInputChange('wantsHomeDetention', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="wantsHomeDetention">Ev hapsi şartları uygun</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="wantsElectronicTag"
                    checked={inputs.wantsElectronicTag}
                    onChange={(e) => handleInputChange('wantsElectronicTag', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="wantsElectronicTag">Elektronik kelepçe uygulanabilir</Label>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateSentence}
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={!inputs.sentenceYears && !inputs.sentenceMonths && !inputs.sentenceDays}
            >
              <Calculator className="h-4 w-4 mr-2" />
              İnfaz Süresini Hesapla
            </Button>

            {/* Results */}
            {results && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-red-600" />
                  İnfaz Hesaplama Sonuçları
                </h3>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Cezaevi Süresi</p>
                          <p className="text-lg font-bold text-red-600">
                            {results.formatDuration(results.prisonDays)}
                          </p>
                        </div>
                        <Shield className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Açık Cezaevi</p>
                          <p className="text-lg font-bold text-blue-600">
                            {results.formatDuration(results.openPrisonDays)}
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Ev Hapsi</p>
                          <p className="text-lg font-bold text-purple-600">
                            {results.formatDuration(results.homeDetentionDays)}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Elektronik Kelepçe</p>
                          <p className="text-lg font-bold text-orange-600">
                            {results.formatDuration(results.electronicTagDays)}
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Calculation Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hesaplama Adımları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Toplam Ceza Süresi</span>
                        <Badge variant="outline">
                          {results.formatDuration(results.totalDays)}
                        </Badge>
                      </div>
                      
                      {results.calculations.map((calc, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span>{calc.type}</span>
                          <div className="text-right">
                            <Badge variant="outline" className={calc.color}>
                              -{results.formatDuration(calc.days)}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Kalan: {results.formatDuration(calc.remaining)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Önemli Uyarı</p>
                      <p>
                        Bu hesaplama genel hukuki düzenlemelere göre yapılmış tahmini bir hesaplamadır. 
                        Kesin süreler mahkeme kararı ve infaz kurumu değerlendirmesine bağlıdır. 
                        Mutlaka bir ceza hukuku uzmanına danışınız.
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

export default SentenceCalculator;