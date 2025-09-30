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
3. [KRİTİK] Blog editöründe biçimlendirme komutları (H1/H2, liste, görsel, slash menü) bazı durumlarda caret konumunda DOM’a uygulanıyor gibi görünse de HTML’e yansımıyor. TipTap state → form state senkronizasyonu ve komutların transaction’larının doğrulanması gerekiyor. Repro: Admin > Blog Yeni → içerikte H1/Liste ekle, kaydet; görüntüle’de düz metin; düzenle’de içerik artık kaybolmuyor fakat anlık uygulama görünmüyor.

## 🎯 SONRAKI ADIMLAR

1. [KRİTİK] TipTap komutlarının kalıcı HTML’e yazdırılması: `onUpdate` yerine transaction sonrası `getHTML()` doğrulaması, `setContent` vs `commands.insertContent` kullanımı, heading/list toggle için `updateAttributes` kontrolü, slash menüsünün selection-range temizliği.
2. Error handling iyileştirmesi  
3. Testing suite ekleme

---
**Son Güncelleme**: 8 Eylül 2025  
**Hazırlayan**: AI Assistant

### Bu Oturumda Yapılanlar (Özet)
- Reklam altyapısı eklendi: Backend `ad_settings` modeli + seed, public `GET /api/ad-settings`, admin `GET/PUT /api/admin/ad-settings`; Frontend `AdsSettingsAdmin` ( `/admin/ads-settings` ) ve `AdBanner` artık API kodlarını render ediyor.
- 422 hatası çözüldü: Backend doğrulama gevşetildi (extra fields ignore, string body coerce), frontend hata logları iyileştirildi.
- Global footer oluşturuldu ve tüm public rotalara eklendi; ana sayfadaki kopya kaldırıldı ve beyaz boşluk sorunu giderildi.
- İçerik şablonları eklendi: Sayfa `/page/:slug` ve kök `/:slug` (dinamik) → `ContentPageTemplate`; Blog yazısı `/blog/:slug` → `BlogPostTemplate`; Yargıtay karar önizleme bileşeni ve detay sayfası `/yargitay/:id` → `SupremeCourtDecisionTemplate`.
- Kök seviye içerik sayfaları için dinamik rota eklendi; `No routes matched` problemi çözüldü (örn. `/gizlilik-politikasi`).
- Adli yardım "gerekli belgeler" alanı DB akışı doğrulandı ve çalışır hale getirildi.
 - Blog editörü popup’tan tam sayfaya taşındı (`BlogPostEdit.jsx`), başlık blur ile slug/SEO başlığı üretimi, içerik blur ile otomatik özet, “Taslak Olarak Kaydet”/“Yayınla” aksiyonları eklendi, görsel yükleme endpoint’i (`POST /api/upload`) devrede.
 - Blog listesi: Dinamik kategori top-5 + “Diğer”, sayfalama ve her 5 kartta bir in-feed reklam; admin reklam ayarlarına `infeed_code` alanı eklendi.

### Yargıtay Kararları - Son Güncellemeler

- Admin’de “Taslak/Yayınla” mantığı düzeltildi; taslağa alınırken `published_at` temizleniyor (is_published=false).
- Eski kayıtlarda `is_published` yoksa yayınlanmış kabul edilerek etiket doğru gösteriliyor (admin listesinde “Yayınlanmış”).
- Kategori etiketleri Türkçeleştirildi (civil → Medeni Hukuk, criminal → Ceza Hukuku, family → Aile Hukuku, labor → İş Hukuku, commercial → Ticaret Hukuku) ve public önizleme kartlarında uygulanıyor.
- Tarih alanı TR formatına sabitlendi ve “Invalid Date” hatası giderildi (admin kartları ve public önizleme).
