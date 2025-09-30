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
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const SupremeCourtDecisionsAdmin = () => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    decision_number: '',
    court_chamber: '',
    decision_date: '',
    case_type: '',
    summary: '',
    content: '',
    keywords: [],
    legal_basis: '',
    category: 'Medeni Hukuk',
    precedent_value: 'Orta',
    tags: [],
    is_published: true
  });

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDecisions(data);
      }
    } catch (error) {
      console.error('Error fetching decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      decision_number: '',
      court_chamber: '',
      decision_date: '',
      case_type: '',
      summary: '',
      content: '',
      keywords: [],
      legal_basis: '',
      category: 'Medeni Hukuk',
      precedent_value: 'Orta',
      tags: [],
      is_published: true
    });
  };

  const handleSave = async (data, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew 
        ? `${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions`
        : `${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions/${data.id}`;
      
      // Process tags and keywords
      const processedData = {
        ...data,
        keywords: Array.isArray(data.keywords) ? data.keywords : 
                 (data.keywords ? data.keywords.split(',').map(k => k.trim()) : []),
        tags: Array.isArray(data.tags) ? data.tags : 
              (data.tags ? data.tags.split(',').map(t => t.trim()) : [])
      };

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        await fetchDecisions();
        if (isNew) {
          setShowAddForm(false);
          resetForm();
        } else {
          setEditingId(null);
        }
      } else {
        const error = await response.text();
        console.error('Save failed:', error);
        alert('Kaydetme işlemi başarısız: ' + error);
      }
    } catch (error) {
      console.error('Error saving decision:', error);
      alert('Kaydetme hatası: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kararı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/supreme-court-decisions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchDecisions();
      }
    } catch (error) {
      console.error('Error deleting decision:', error);
    }
  };

  const filteredDecisions = decisions.filter(decision => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (decision.decision_number || '').toLowerCase().includes(searchLower) ||
      (decision.case_type || '').toLowerCase().includes(searchLower) ||
      (decision.summary || '').toLowerCase().includes(searchLower) ||
      (decision.court_chamber || '').toLowerCase().includes(searchLower)
    );
  });

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

  const DecisionForm = ({ data, onChange, onSave, onCancel, isNew = false }) => (
    <Card className="border-blue-300 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-blue-600">
          {isNew ? 'Yeni Yargıtay Kararı' : 'Karar Düzenleme'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Karar Numarası *
            </label>
            <input
              type="text"
              value={data.decision_number}
              onChange={(e) => onChange('decision_number', e.target.value)}
              placeholder="örn: 2024/1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daire *
            </label>
            <input
              type="text"
              value={data.court_chamber}
              onChange={(e) => onChange('court_chamber', e.target.value)}
              placeholder="örn: 15. Hukuk Dairesi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Karar Tarihi *
            </label>
            <input
              type="date"
              value={data.decision_date}
              onChange={(e) => onChange('decision_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dava Türü *
            </label>
            <input
              type="text"
              value={data.case_type}
              onChange={(e) => onChange('case_type', e.target.value)}
              placeholder="örn: Boşanma, İş Kazası, Dolandırıcılık"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <select
              value={data.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Medeni Hukuk">Medeni Hukuk</option>
              <option value="Ceza Hukuku">Ceza Hukuku</option>
              <option value="İş Hukuku">İş Hukuku</option>
              <option value="Ticaret Hukuku">Ticaret Hukuku</option>
              <option value="İdari Hukuk">İdari Hukuk</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Önem Derecesi
            </label>
            <select
              value={data.precedent_value}
              onChange={(e) => onChange('precedent_value', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Yüksek">Yüksek</option>
              <option value="Orta">Orta</option>
              <option value="Düşük">Düşük</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Karar Özeti *
          </label>
          <textarea
            value={data.summary}
            onChange={(e) => onChange('summary', e.target.value)}
            placeholder="Kararın kısa özeti..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Karar Metni *
          </label>
          <textarea
            value={data.content}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="Kararın tam metni..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hukuki Dayanak
          </label>
          <input
            type="text"
            value={data.legal_basis}
            onChange={(e) => onChange('legal_basis', e.target.value)}
            placeholder="örn: TMK m. 166, BK m. 49"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anahtar Kelimeler
            </label>
            <input
              type="text"
              value={Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords}
              onChange={(e) => onChange('keywords', e.target.value)}
              placeholder="virgülle ayırın: boşanma, mal paylaşımı, velayet"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiketler
            </label>
            <input
              type="text"
              value={Array.isArray(data.tags) ? data.tags.join(', ') : data.tags}
              onChange={(e) => onChange('tags', e.target.value)}
              placeholder="virgülle ayırın: boşanma, tazminat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_published"
            checked={data.is_published}
            onChange={(e) => onChange('is_published', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
            Yayınlansın
          </label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            İptal
          </Button>
          <Button onClick={() => onSave(data, isNew)} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isNew ? 'Kaydet' : 'Güncelle'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
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
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Karar ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <DecisionForm
          data={formData}
          onChange={(field, value) => setFormData({...formData, [field]: value})}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            resetForm();
          }}
          isNew={true}
        />
      )}

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz Yargıtay kararı eklenmemiş.</p>
            </CardContent>
          </Card>
        ) : (
          filteredDecisions.map((decision) => (
            <Card key={decision.id} className="hover:shadow-md transition-shadow">
              {editingId === decision.id ? (
                <DecisionForm
                  data={decision}
                  onChange={(field, value) => {
                    const updatedDecision = {...decision, [field]: value};
                    setDecisions(decisions.map(d => d.id === decision.id ? updatedDecision : d));
                  }}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                  isNew={false}
                />
              ) : (
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{decision.decision_number}</Badge>
                        <Badge className="bg-blue-100 text-blue-700">{decision.category}</Badge>
                        <Badge variant={decision.precedent_value === 'Yüksek' ? 'default' : 'secondary'}>
                          {decision.precedent_value}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {decision.case_type}
                      </h3>
                      <p className="text-gray-600 mb-2">{decision.summary}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {decision.decision_date}
                        </span>
                        <span className="flex items-center">
                          <Gavel className="h-4 w-4 mr-1" />
                          {decision.court_chamber}
                        </span>
                      </div>
                      {decision.tags && decision.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {decision.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(decision.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(decision.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupremeCourtDecisionsAdmin;