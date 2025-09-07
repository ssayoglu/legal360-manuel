# 🤖 AI AGENT - HIZLI BAŞLANGIÇ

> **Bu dosya yapay zeka ajanları için hazırlanmıştır**

## 🚀 HIZLI BAŞLATMA

```bash
# 1. MongoDB başlat
brew services start mongodb-community

# 2. Backend başlat
cd backend
MONGO_URL=mongodb://localhost:27017 DB_NAME=legal360 JWT_SECRET=your-secret-key PORT=8001 python3 server.py

# 3. Frontend başlat
cd frontend
npm start
```

## 📊 SİSTEM DURUMU

- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:8001 ✅  
- **Database**: MongoDB ✅
- **Durum**: Çalışır durumda

## 📁 ÖNEMLİ DOSYALAR

- **Detaylı Rapor**: `README_AI.md` 📋
- **Sistem Durumu**: `backup/SYSTEM_STATUS.md` 🔧
- **Admin Panel**: http://localhost:3000/admin/login 🔐

## ⚠️ BİLİNEN SORUNLAR

1. Port 8001 çakışması olabilir
2. Deprecated FastAPI warnings
3. Blog editörü eksik

## 🎯 SONRAKI ADIMLAR

1. Blog editörü entegrasyonu
2. Error handling iyileştirmesi  
3. Testing suite ekleme

---
**Son Güncelleme**: 7 Eylül 2025  
**Hazırlayan**: AI Assistant

## 📝 SON GÜNCELLEME NOTLARI (7 Eylül 2025)

### Frontend
- Public sayfalarda mock bağımlılığı kaldırıldı; veri tamamen backend API'lerinden geliyor:
  - Yargıtay: `/api/supreme-court-decisions`
  - Blog: `/api/blog-posts`
  - Adli Yardım: `/api/legal-aid-info`
  - Süreç Listesi: `/api/legal-processes`
  - Süreç Detay: `/api/legal-processes/{id}`
- Demo/test bileşenleri yedekte tutuluyor ancak akışta kullanılmıyor:
  - `ProcessList.jsx`, `ProcessFlowWithHeaderDebug.jsx`, `ProcessFlowWithHeaderDebug2.jsx`, `UIComponentTest.jsx`
- `frontend/src/data/mock.js` yalnızca DEMO/Test içindir; README'ye not eklendi.

### Admin (Yargıtay Kararları)
- `SupremeCourtDecisionsAdmin.jsx` backend şemasıyla hizalandı:
  - Alanlar: `decision_number`, `date`, `court`, `keywords`, `importance_level`
  - UI → API payload mapping ve boş değerleri filtreleme eklendi.

### Backend
- `PUT /api/admin/supreme-court-decisions/{id}` güncellemesinde boş string/list/dict değerleri yoksayacak şekilde koruma eklendi (alanların yanlışlıkla boşaltılmasını engeller).

### Dokümantasyon
- `README.md` içine “mock veriler sadece demo içindir” notu eklendi.

### Çalıştırma İpucu
- CRA dev server için lokal `craco` bulunamazsa: `npx --yes @craco/craco@7.1.0 start` kullanın. 
- Frontend'i backend'e bağlamak için: `REACT_APP_BACKEND_URL=http://localhost:8001`.

### Hızlı Doğrulama
```bash
# Public API kontrolleri
curl -sS http://localhost:8001/api/supreme-court-decisions | jq 'length'
curl -sS http://localhost:8001/api/legal-processes | jq 'length'
curl -sS http://localhost:8001/api/blog-posts?limit=5 | jq 'length'
curl -sS http://localhost:8001/api/legal-aid-info | jq '.title'
```
