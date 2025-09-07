# 🏛️ Legal Design Turkey

> **🤖 AI AGENT NOTICE:** Bu proje için detaylı bilgi için `README_AI.md` dosyasını okuyun!

## 🚀 Hızlı Başlangıç

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

## 📁 Proje Yapısı

- `README_AI.md` - 🤖 AI ajanları için detaylı rapor
- `AI_AGENT_NOTES.md` - 🤖 Hızlı başlangıç notları
- `backup/SYSTEM_STATUS.md` - 🔧 Sistem durumu
- `frontend/` - React uygulaması
- `backend/` - FastAPI uygulaması

## 🎯 Özellikler

- Hukuki süreçler görselleştirme
- Adli yardım bilgileri
- Admin paneli
- Hesaplama araçları
- Responsive tasarım

## 🧪 Demo/Mock Veriler Hakkında

- `frontend/src/data/mock.js` yalnızca DEMO ve test amaçlıdır.
- Üretim (production) veya gerçek kullanım senaryolarında frontend tüm verileri backend API'lerinden çeker.
- Mock veriler, debug/demo sayfaları haricinde uygulama akışında kullanılmaz.

---
**Son Güncelleme**: 7 Eylül 2025
