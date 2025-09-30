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

## 🔧 Ortam Değişkenleri (Geliştirme)

Backend için `backend/.env` ve frontend için `frontend/.env` dosyalarını oluşturun:

```bash
# backend/.env
MONGO_URL=mongodb://localhost:27017
DB_NAME=legal360
JWT_SECRET=your-secret-key
PORT=8001
CORS_ORIGINS=*
```

```bash
# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Not: Frontend varsayılan olarak `http://localhost:8001` adresine bağlanacak şekilde yapılandırıldı.

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

## ♻️ Yedekten Geri Yükleme

```bash
# 1) Yedek klasörünü seçin (örnek)
BACKUP_DIR=backup/db/backup-20250908_010450

# 2) Koleksiyonları içeri aktarın (jsonArray dosyaları için)
for f in "$BACKUP_DIR"/*.json; do \
  c=$(basename "$f" .json); \
  echo "Importing $c"; \
  mongoimport --uri mongodb://localhost:27017 \
    --db legal360 --collection "$c" \
    --drop --jsonArray --file "$f"; \
done

# 3) Doğrulama (koleksiyon ve döküman sayıları)
mongosh --quiet mongodb://localhost:27017 --eval "db.getSiblingDB('legal360').getCollectionNames().forEach(c=>print(c, db.getSiblingDB('legal360').getCollection(c).countDocuments()))"
```

---
**Son Güncelleme**: 7 Eylül 2025
