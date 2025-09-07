import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info } from 'lucide-react';

const CostBreakdown = ({ process, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const costs = process.estimatedCosts;

  const getTotalMin = () => (costs.items || []).reduce((sum, item) => sum + item.min, 0);
  const getTotalMax = () => (costs.items || []).reduce((sum, item) => sum + item.max, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0">
          <CardHeader className={`bg-gradient-to-r ${process.gradient} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6" />
                <div>
                  <CardTitle className="text-lg">{costs.title}</CardTitle>
                  <CardDescription className="text-white/80">
                    {process.title} için tahmini maliyet analizi
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
            {/* Cost Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Toplam Tahmini Maliyet</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {costs.totalRange}
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center text-green-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Min: ₺{getTotalMin().toLocaleString('tr-TR')}
                  </div>
                  <div className="flex items-center text-red-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Max: ₺{getTotalMax().toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Maliyet Kalemleri</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Özet Görünüm' : 'Detayları Göster'}
                </Button>
              </div>

              {(costs.items || []).map((item, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="flex items-center space-x-2">
                        {item.min === 0 ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Ücretsiz Olabilir
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            ₺{item.min.toLocaleString('tr-TR')} - ₺{item.max.toLocaleString('tr-TR')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {showDetails && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{item.note}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Free Options */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Ücretsiz/İndirimli Seçenekler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(costs.freeOptions || []).map((option, index) => (
                    <div key={index} className="flex items-start text-sm text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Önemli Uyarı</p>
                  <p>
                    Bu maliyetler tahmini değerlerdir ve gerçek tutarlar duruma göre değişebilir. 
                    Kesin maliyet bilgisi için mutlaka bir hukuk uzmanına danışınız. 
                    Adli yardım hakkından yararlanabileceğinizi unutmayın.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('/legal-aid', '_blank')}
              >
                Adli Yardım Bilgileri
              </Button>
              <Button
                onClick={onClose}
                className={`flex-1 bg-gradient-to-r ${process.gradient} hover:opacity-90`}
              >
                Tamam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostBreakdown;