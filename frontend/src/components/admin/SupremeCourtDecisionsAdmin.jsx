import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar,
  Gavel,
  FileText,
  AlertCircle
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const SupremeCourtDecisionsAdmin = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDecision, setEditingDecision] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDecision, setNewDecision] = useState({
    title: '',
    case_number: '',
    decision_date: '',
    summary: '',
    full_text: '',
    category: 'civil',
    is_published: true
  });

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDecisions(data);
      } else {
        console.error('Failed to fetch supreme court decisions');
        // Mock data fallback
        setDecisions([
          {
            id: "mock-1",
            title: "İş Sözleşmesinin Feshi ve Kıdem Tazminatı",
            case_number: "2019/1234",
            decision_date: "2023-01-15",
            summary: "İş sözleşmesinin haksız feshi durumunda kıdem tazminatı ödenmesi gerektiği",
            full_text: "Detaylı karar metni...",
            category: "civil",
            is_published: true
          },
          {
            id: "mock-2",
            title: "Boşanma Davasında Mal Paylaşımı",
            case_number: "2020/5678",
            decision_date: "2023-03-20",
            summary: "Boşanma davasında mal paylaşımına dair önemli karar",
            full_text: "Detaylı karar metni...",
            category: "family",
            is_published: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching supreme court decisions:', error);
      // Mock data fallback
      setDecisions([
        {
          id: "mock-1",
          title: "İş Sözleşmesinin Feshi ve Kıdem Tazminatı",
          case_number: "2019/1234",
          decision_date: "2023-01-15",
          summary: "İş sözleşmesinin haksız feshi durumunda kıdem tazminatı ödenmesi gerektiği",
          full_text: "Detaylı karar metni...",
          category: "civil",
          is_published: true
        },
        {
          id: "mock-2",
          title: "Boşanma Davasında Mal Paylaşımı",
          case_number: "2020/5678",
          decision_date: "2023-03-20",
          summary: "Boşanma davasında mal paylaşımına dair önemli karar",
          full_text: "Detaylı karar metni...",
          category: "family",
          is_published: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (decisionData, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew 
        ? `${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions`
        : `${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions/${decisionData.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(decisionData),
      });

      if (response.ok) {
        fetchDecisions();
        setEditingDecision(null);
        setShowAddForm(false);
        setNewDecision({
          title: '',
          case_number: '',
          decision_date: '',
          summary: '',
          full_text: '',
          category: 'civil',
          is_published: true
        });
      } else {
        console.error('Failed to save decision');
      }
    } catch (error) {
      console.error('Error saving decision:', error);
    }
  };

  const handleDelete = async (decisionId) => {
    if (!window.confirm('Bu yargıtay kararını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions/${decisionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDecisions(decisions.filter(d => d.id !== decisionId));
      } else {
        console.error('Failed to delete decision');
      }
    } catch (error) {
      console.error('Error deleting decision:', error);
    }
  };

  const handleEdit = (decision) => {
    setEditingDecision({ ...decision });
  };

  const handleCancelEdit = () => {
    setEditingDecision(null);
  };

  const filteredDecisions = decisions.filter(decision =>
    decision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decision.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decision.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yargıtay kararları yükleniyor...</p>
        </div>
      </div>
    );
  }

  const DecisionCard = ({ decision, isEditing = false, onSave, onCancel, onEdit, onDelete }) => {
    const [editData, setEditData] = useState(decision);

    const handleInputChange = (field, value) => {
      setEditData({ ...editData, [field]: value });
    };

    if (isEditing) {
      return (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-sm text-blue-600">Karar Düzenleme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karar Başlığı
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosya Numarası
                </label>
                <input
                  type="text"
                  value={editData.case_number}
                  onChange={(e) => handleInputChange('case_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karar Tarihi
                </label>
                <input
                  type="date"
                  value={editData.decision_date}
                  onChange={(e) => handleInputChange('decision_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={editData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="civil">Medeni Hukuk</option>
                  <option value="criminal">Ceza Hukuku</option>
                  <option value="family">Aile Hukuku</option>
                  <option value="labor">İş Hukuku</option>
                  <option value="commercial">Ticaret Hukuku</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Özet
              </label>
              <textarea
                value={editData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tam Metin
              </label>
              <textarea
                value={editData.full_text}
                onChange={(e) => handleInputChange('full_text', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`published-${editData.id}`}
                checked={editData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`published-${editData.id}`} className="text-sm text-gray-700">
                Yayınlanmış
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onSave(editData)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${decision.is_published ? 'border-green-200' : 'border-gray-200 opacity-75'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{decision.title}</CardTitle>
              <CardDescription className="mt-1">{decision.summary}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {decision.is_published ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Yayınlanmış
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Taslak
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Gavel className="h-4 w-4 mr-2" />
              <span>Dosya No: {decision.case_number}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Tarih: {new Date(decision.decision_date).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>Kategori: {decision.category}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(decision)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(decision.id)}
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
          <h1 className="text-2xl font-bold text-gray-900">Yargıtay Kararları</h1>
          <p className="text-gray-600">Yargıtay kararlarını yönetin</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Karar Ekle
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Karar ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add New Decision Form */}
      {showAddForm && (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Yeni Yargıtay Kararı Ekle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karar Başlığı
                </label>
                <input
                  type="text"
                  value={newDecision.title}
                  onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Karar başlığını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosya Numarası
                </label>
                <input
                  type="text"
                  value={newDecision.case_number}
                  onChange={(e) => setNewDecision({ ...newDecision, case_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: 2019/1234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karar Tarihi
                </label>
                <input
                  type="date"
                  value={newDecision.decision_date}
                  onChange={(e) => setNewDecision({ ...newDecision, decision_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newDecision.category}
                  onChange={(e) => setNewDecision({ ...newDecision, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="civil">Medeni Hukuk</option>
                  <option value="criminal">Ceza Hukuku</option>
                  <option value="family">Aile Hukuku</option>
                  <option value="labor">İş Hukuku</option>
                  <option value="commercial">Ticaret Hukuku</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Özet
              </label>
              <textarea
                value={newDecision.summary}
                onChange={(e) => setNewDecision({ ...newDecision, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Karar özetini girin..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tam Metin
              </label>
              <textarea
                value={newDecision.full_text}
                onChange={(e) => setNewDecision({ ...newDecision, full_text: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kararın tam metnini girin..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new-published"
                checked={newDecision.is_published}
                onChange={(e) => setNewDecision({ ...newDecision, is_published: e.target.checked })}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="new-published" className="text-sm text-gray-700">
                Yayınlanmış
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleSave(newDecision, true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decisions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecisions.map((decision) => (
          <DecisionCard
            key={decision.id}
            decision={decision}
            isEditing={editingDecision?.id === decision.id}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {filteredDecisions.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Karar bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Arama kriterlerinize uygun karar bulunamadı.' : 'Henüz yargıtay kararı eklenmemiş.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupremeCourtDecisionsAdmin;
