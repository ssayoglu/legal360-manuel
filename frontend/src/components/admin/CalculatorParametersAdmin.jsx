import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calculator,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const CalculatorParametersAdmin = () => {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingParam, setEditingParam] = useState(null);
  const [newParam, setNewParam] = useState({
    name: '',
    value: '',
    description: '',
    category: 'compensation',
    unit: '',
    is_active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/calculator-parameters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParameters(data);
      } else {
        console.error('Failed to fetch parameters');
        // Mock data fallback
        setParameters([
          {
            id: "mock-1",
            name: "Kıdem Tazminatı Çarpanı",
            value: 30.0,
            description: "Her hizmet yılı için brüt aylık ücret tutarı",
            category: "compensation",
            unit: "gün",
            is_active: true
          },
          {
            id: "mock-2",
            name: "İhbar Tazminatı Süresi",
            value: 2.0,
            description: "İhbar öneli süresi (ay)",
            category: "compensation",
            unit: "ay",
            is_active: true
          },
          {
            id: "mock-3",
            name: "Fazla Mesai Saatlik Ücret Çarpanı",
            value: 1.5,
            description: "Normal saatin üzerindeki mesai çarpanı",
            category: "compensation",
            unit: "kat",
            is_active: true
          },
          {
            id: "mock-4",
            name: "Yıllık İzin Ücreti",
            value: 14.0,
            description: "Kullanılmayan yıllık izin gün sayısı",
            category: "compensation",
            unit: "gün",
            is_active: true
          },
          {
            id: "mock-5",
            name: "İyi Hal İndirimi Oranı",
            value: 33.0,
            description: "İyi halli tutuklu için indirim oranı",
            category: "execution",
            unit: "%",
            is_active: true
          },
          {
            id: "mock-6",
            name: "Koşullu Salıverilme Oranı",
            value: 50.0,
            description: "Cezanın ne kadarı çekildikten sonra koşullu salıverilme",
            category: "execution",
            unit: "%",
            is_active: true
          },
          {
            id: "mock-7",
            name: "Denetimli Serbestlik Oranı",
            value: 75.0,
            description: "Cezanın ne kadarı çekildikten sonra denetimli serbestlik",
            category: "execution",
            unit: "%",
            is_active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching parameters:', error);
      // Mock data fallback
      setParameters([
        {
          id: "mock-1",
          name: "Kıdem Tazminatı Çarpanı",
          value: 30.0,
          description: "Her hizmet yılı için brüt aylık ücret tutarı",
          category: "compensation",
          unit: "gün",
          is_active: true
        },
        {
          id: "mock-2",
          name: "İhbar Tazminatı Süresi",
          value: 2.0,
          description: "İhbar öneli süresi (ay)",
          category: "compensation",
          unit: "ay",
          is_active: true
        },
        {
          id: "mock-3",
          name: "Fazla Mesai Saatlik Ücret Çarpanı",
          value: 1.5,
          description: "Normal saatin üzerindeki mesai çarpanı",
          category: "compensation",
          unit: "kat",
          is_active: true
        },
        {
          id: "mock-4",
          name: "Yıllık İzin Ücreti",
          value: 14.0,
          description: "Kullanılmayan yıllık izin gün sayısı",
          category: "compensation",
          unit: "gün",
          is_active: true
        },
        {
          id: "mock-5",
          name: "İyi Hal İndirimi Oranı",
          value: 33.0,
          description: "İyi halli tutuklu için indirim oranı",
          category: "execution",
          unit: "%",
          is_active: true
        },
        {
          id: "mock-6",
          name: "Koşullu Salıverilme Oranı",
          value: 50.0,
          description: "Cezanın ne kadarı çekildikten sonra koşullu salıverilme",
          category: "execution",
          unit: "%",
          is_active: true
        },
        {
          id: "mock-7",
          name: "Denetimli Serbestlik Oranı",
          value: 75.0,
          description: "Cezanın ne kadarı çekildikten sonra denetimli serbestlik",
          category: "execution",
          unit: "%",
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (paramData, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew 
        ? `${API_CONFIG.BACKEND_URL}/api/admin/calculator-parameters`
        : `${API_CONFIG.BACKEND_URL}/api/admin/calculator-parameters/${paramData.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: paramData.name,
          value: parseFloat(paramData.value),
          description: paramData.description,
          category: paramData.category,
          unit: paramData.unit,
          is_active: paramData.is_active
        }),
      });

      if (response.ok) {
        fetchParameters();
        setEditingParam(null);
        setShowAddForm(false);
        setNewParam({
          name: '',
          value: '',
          description: '',
          category: 'compensation',
          unit: '',
          is_active: true
        });
      } else {
        console.error('Failed to save parameter');
      }
    } catch (error) {
      console.error('Error saving parameter:', error);
    }
  };

  const handleDelete = async (paramId) => {
    if (!window.confirm('Bu parametreyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/calculator-parameters/${paramId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setParameters(parameters.filter(p => p.id !== paramId));
      } else {
        console.error('Failed to delete parameter');
      }
    } catch (error) {
      console.error('Error deleting parameter:', error);
    }
  };

  const handleEdit = (param) => {
    setEditingParam({ ...param });
  };

  const handleCancelEdit = () => {
    setEditingParam(null);
  };

  const compensationParams = parameters.filter(p => p.category === 'compensation');
  const executionParams = parameters.filter(p => p.category === 'execution');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Parametreler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const ParameterCard = ({ param, isEditing = false, onSave, onCancel, onEdit, onDelete }) => {
    const [editData, setEditData] = useState(param);

    const handleInputChange = (field, value) => {
      setEditData({ ...editData, [field]: value });
    };

    if (isEditing) {
      return (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-sm text-blue-600">Parametre Düzenleme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parametre Adı
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Değer
              </label>
              <input
                type="number"
                step="0.01"
                value={editData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birim
              </label>
              <input
                type="text"
                value={editData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="TL, %, gün, ay..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={editData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`active-${editData.id}`}
                checked={editData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`active-${editData.id}`} className="text-sm text-gray-700">
                Aktif
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onSave(editData)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${param.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{param.name}</CardTitle>
              <CardDescription className="mt-1">{param.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {param.is_active ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktif
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pasif
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-blue-600">
              {param.value} {param.unit}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(param)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(param.id)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hesaplayıcı Parametreleri</h1>
          <p className="text-gray-600">Tazminat ve infaz hesaplayıcı parametrelerini yönetin</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Parametre Ekle
        </Button>
      </div>

      {/* Add New Parameter Form */}
      {showAddForm && (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Yeni Parametre Ekle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parametre Adı
                </label>
                <input
                  type="text"
                  value={newParam.name}
                  onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: Kıdem Tazminatı Çarpanı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newParam.category}
                  onChange={(e) => setNewParam({ ...newParam, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="compensation">Tazminat Hesaplayıcı</option>
                  <option value="execution">İnfaz Hesaplayıcı</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Değer
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newParam.value}
                  onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birim
                </label>
                <input
                  type="text"
                  value={newParam.unit}
                  onChange={(e) => setNewParam({ ...newParam, unit: e.target.value })}
                  placeholder="TL, %, gün, ay..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={newParam.description}
                onChange={(e) => setNewParam({ ...newParam, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bu parametrenin kullanım amacını açıklayın..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new-active"
                checked={newParam.is_active}
                onChange={(e) => setNewParam({ ...newParam, is_active: e.target.checked })}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="new-active" className="text-sm text-gray-700">
                Aktif
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleSave(newParam, true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compensation Parameters */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Tazminat Hesaplayıcı Parametreleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compensationParams.map((param) => (
            <ParameterCard
              key={param.id}
              param={param}
              isEditing={editingParam?.id === param.id}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {compensationParams.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Parametre bulunamadı</h3>
                <p className="text-gray-600">Henüz tazminat hesaplayıcı parametresi eklenmemiş.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Execution Parameters */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          İnfaz Hesaplayıcı Parametreleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {executionParams.map((param) => (
            <ParameterCard
              key={param.id}
              param={param}
              isEditing={editingParam?.id === param.id}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {executionParams.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Parametre bulunamadı</h3>
                <p className="text-gray-600">Henüz infaz hesaplayıcı parametresi eklenmemiş.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorParametersAdmin;