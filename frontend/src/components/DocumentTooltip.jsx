import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const documentDescriptions = {
  'Kimlik belgesi': 'T.C. kimlik kartı veya nüfus cüzdanının aslı ve fotokopisi',
  'Evlilik cüzdanı': 'Nüfus müdürlüğünden alınan güncel evlilik cüzdanı',
  'Gelir belgesi': 'Maaş bordrosu, SGK hizmet dökümü veya gelir beyannamesi',
  'Arabuluculuk başvuru formu': 'Arabuluculuk merkezinden temin edilecek standart başvuru formu',
  'Dava dilekçesi': 'Avukat tarafından hazırlanacak mahkemeye sunulacak dilekçe',
  'Anlaşma protokolü': 'Eşler arası anlaşmanın yazılı hale getirilmiş şekli',
  'Mali durum belgeleri': 'Banka hesap dökümü, tapu senedi, araç ruhsatı gibi mal varlığı belgeleri',
  'Delil belgeleri': 'SMS, e-posta, fotoğraf, video gibi iddiayı destekleyici belgeler',
  'Tanık listesi': 'Olayı bilen kişilerin ad, soyad ve adres bilgileri',
  'Kesinleşmiş mahkeme kararı': 'Temyiz süresinin dolduğu veya onaylandığı nihai karar',
  'Nüfus cüzdanı': 'Güncel nüfus cüzdanı aslı ve fotokopisi',
  'Doktor raporu': 'Ölüm nedenini belirten resmi sağlık kurumu raporu',
  'Hastane belgesi': 'Hastaneden alınan ölüm raporu ve tedavi kayıtları',
  'Nüfus kayıt örnekleri': 'Tüm aile bireylerinin nüfus kayıt örnekleri',
  'Vasiyetname (varsa)': 'Noter onaylı vasiyetname veya el yazısı vasiyetname',
  'Tapu senedi': 'Gayrimenkul malların tapu müdürlüğü kayıtları',
  'Mirasçı belgeleri': 'Mirasçıların kimlik ve yakınlık belgeleri',
  'Paylaşım sözleşmesi': 'Noter huzurunda imzalanacak miras paylaşım anlaşması',
  'Miras belgesi': 'Veraset ilamı veya miras sertifikası',
  'Değerleme raporları': 'Gayrimenkul ve diğer malların ekspertiz raporları',
  'Vergi borcu belgesi': 'Vergi dairesinden alınan borç durumu belgesi',
  'İş sözleşmesi': 'İmzalanmış iş sözleşmesi aslı ve fotokopisi',
  'Bordro örnekleri': 'Son 6 aylık maaş bordroları',
  'İşten çıkış belgesi': 'İşverenden alınan işten ayrılış belgesi',
  'Alacak hesap cetveli': 'Kıdem, ihbar, fazla mesai gibi alacakların detaylı hesabı',
  'Çalışma belgeleri': 'SGK hizmet dökümü, işe giriş bildirgesi gibi belgeler',
  'Alacak hesabı': 'Yasal alacakların detaylı hesap çizelgesi',
  'İcra takip talep formu': 'İcra müdürlüğünden temin edilecek takip formu',
  'İcra takip belgesi': 'İcra müdürlüğünden alınan takip evrakları',
  'Banka hesap bilgileri': 'IBAN ve hesap sahibi bilgileri',
  'Şikayet dilekçesi': 'Suçu detaylı şekilde anlatan resmi dilekçe',
  'İfade tutanakları': 'Polis karakolunda verilen ifade tutanakları',
  'Delil toplama': 'Suçla ilgili tüm fiziksel ve dijital deliller',
  'Bilirkişi raporları': 'Uzman kişilerce hazırlanan teknik raporlar',
  'İddianame': 'Savcı tarafından hazırlanan suçlama belgesi',
  'Soruşturma dosyası': 'Tüm soruşturma evrakları ve deliller',
  'Delil listesi': 'Mahkemeye sunulacak delillerin listesi',
  'Kovuşturmama kararı': 'Savcının dava açmama kararı belgesi',
  'İtiraz dilekçesi (varsa)': 'Kovuşturmama kararına yapılan itiraz dilekçesi',
  'Duruşma tutanakları': 'Mahkeme duruşmalarının yazılı kayıtları',
  'Delil sunumu': 'Mahkemede sunulan tüm delil ve belgeler',
  'Tanık ifadeleri': 'Mahkemede dinlenen tanık ifade tutanakları',
  'Beraat kararı': 'Sanığın suçsuz olduğuna dair mahkeme kararı',
  'Temyiz dilekçesi (varsa)': 'Yargıtay\'a yapılan başvuru dilekçesi',
  'Mahkumiyet kararı': 'Sanığın suçlu bulunduğuna dair mahkeme kararı',
  'İnfaz belgesi': 'Cezanın infazı için gerekli resmi belgeler'
};

const DocumentTooltip = ({ document, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const description = documentDescriptions[document];

  if (!description) {
    return children;
  }

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onTouchStart={() => setIsVisible(true)}
        onTouchEnd={() => setTimeout(() => setIsVisible(false), 3000)}
      >
        {children}
        <HelpCircle className="h-3 w-3 text-gray-400 ml-1 flex-shrink-0" />
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -top-2 left-full ml-2 transform">
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          <div className="font-medium mb-1">{document}</div>
          <div className="text-gray-300 leading-relaxed">{description}</div>
        </div>
      )}
    </div>
  );
};

export default DocumentTooltip;