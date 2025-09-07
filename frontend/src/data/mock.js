// Mock data for Legal Design Turkey application

// Document descriptions for tooltips
export const documentDescriptions = {
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

// Legal Aid Information
export const legalAidInfo = {
  title: 'Adli Yardım ve Ücretsiz Hukuki Destek',
  description: 'Maddi durumu yetersiz vatandaşlar için ücretsiz hukuki yardım imkanları',
  sections: [
    {
      title: 'Adli Yardım Nedir?',
      icon: 'Scale',
      content: 'Devlet tarafından maddi durumu yetersiz vatandaşlara sağlanan ücretsiz hukuki yardım hizmetidir. Avukat ücreti, harç, tebligat ve diğer giderler devlet tarafından karşılanır.',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Kimler Yararlanabilir?',
      icon: 'Users',
      content: 'Aylık geliri asgari ücretin iki katından az olan, sosyal güvenlik primi veya vergi mükellefi olmayan vatandaşlar adli yardımdan yararlanabilir.',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Nasıl Başvurulur?',
      icon: 'FileText',
      content: 'Adli yardım büroları, baroların hukuk işleri müdürlükleri veya online başvuru sistemi üzerinden başvuru yapılabilir. Gelir belgesi ve kimlik belgesi gereklidir.',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Ücretsiz Hukuki Danışmanlık',
      icon: 'MessageCircle',
      content: 'Barolar ücretsiz hukuki danışmanlık hizmeti verir. ALO 175 hattından da ücretsiz hukuki bilgi alınabilir.',
      color: 'bg-orange-100 text-orange-800'
    }
  ],
  baroContacts: [
    {
      city: 'İstanbul',
      name: 'İstanbul Barosu',
      phone: '0212 292 85 00',
      address: 'Orhan Adli Apaydın Sokak No:15 Sişli/İstanbul',
      website: 'www.istanbulbarosu.org.tr'
    },
    {
      city: 'Ankara',
      name: 'Ankara Barosu',
      phone: '0312 425 21 04',
      address: 'Kumrular Sokak No:6 Kızılay/Ankara',
      website: 'www.ankarabarosu.org.tr'
    },
    {
      city: 'İzmir',
      name: 'İzmir Barosu',
      phone: '0232 463 85 00',
      address: 'Şehit Nevres Bulvarı No:62 Konak/İzmir',
      website: 'www.izmirbarosu.org.tr'
    },
    {
      city: 'Bursa',
      name: 'Bursa Barosu',
      phone: '0224 220 37 00',
      address: 'Altıparmak Caddesi Okçular Sokak No:4 Osmangazi/Bursa',
      website: 'www.bursabarosu.org.tr'
    }
  ],
  helplines: [
    {
      name: 'ALO 175 - Adalet Bakanlığı',
      description: 'Ücretsiz hukuki bilgi hattı',
      phone: '175',
      hours: '24 saat'
    },
    {
      name: 'Kadın Acil Yardım Hattı',
      description: 'Kadına yönelik şiddet durumlarında',
      phone: '183',
      hours: '24 saat'
    },
    {
      name: 'Çocuk İhbar Hattı',
      description: 'Çocuk hakları ihlalleri için',
      phone: '183',
      hours: '24 saat'
    }
  ]
};

export const legalProcesses = [
  {
    id: 'bosanma-sureci',
    title: 'Boşanma Süreci',
    description: 'Boşanma davası ve arabuluculuk süreçleri',
    icon: 'Heart',
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    duration: '6-12 ay',
    difficulty: 'Orta',
    totalSteps: 6,
    hasCalculator: false,
    category: 'hukuk',
    tags: ['boşanma', 'aile hukuku', 'arabuluculuk', 'mahkeme'],
    estimatedCosts: {
      title: 'Boşanma Davası Tahmini Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 5000, max: 25000, note: 'Anlaşmalı daha ucuz, çekişmeli daha pahalı' },
        { name: 'Dava Harcı', min: 150, max: 500, note: 'Davaya konu mal varlığına göre değişir' },
        { name: 'Arabuluculuk Ücreti', min: 0, max: 2000, note: 'Zorunlu değil, ama önerilir' },
        { name: 'Noter Masrafları', min: 200, max: 1000, note: 'Anlaşma protokolü için' },
        { name: 'Keşif/Bilirkişi', min: 0, max: 5000, note: 'Mal paylaşımı varsa gerekebilir' },
        { name: 'Temyiz Masrafları', min: 0, max: 3000, note: 'Karara itiraz edilirse' }
      ],
      totalRange: '5.350 - 36.500 TL',
      freeOptions: [
        'Adli yardımdan yararlanabilirsiniz (gelir şartı var)',
        'Anlaşmalı boşanmada tek avukat yeterli',
        'Bazı barolar ücretsiz danışmanlık verir'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Hukuki Danışmanlık',
        shortTitle: 'Danışmanlık',
        description: 'Bir avukatla görüşerek boşanma sürecinin detayları hakkında bilgi alın. Haklarınızı ve yükümlülüklerinizi öğrenin.',
        duration: '1-2 saat',
        participants: ['Avukat', 'Danışan'],
        requiredDocuments: [
          'Kimlik belgesi',
          'Evlilik cüzdanı',
          'Gelir belgesi'
        ],
        importantNotes: [
          'Boşanma sebeplerini belirleyin',
          'Mal paylaşımı konularını değerlendirin',
          'Çocuk velayeti durumunu görüşün'
        ],
        position: { x: 50, y: 50 },
        connections: ['step2'],
        status: 'active'
      },
      {
        id: 'step2',
        title: 'Arabuluculuk',
        shortTitle: 'Arabuluculuk',
        description: 'Mahkeme öncesi arabuluculuk sürecini deneyin. Arabulucu, tarafsız bir üçüncü kişi olarak anlaşmanızı sağlamaya çalışır.',
        duration: '2-4 hafta',
        participants: ['Arabulucu', 'Eşler', 'Avukatlar'],
        requiredDocuments: [
          'Arabuluculuk başvuru formu',
          'Kimlik belgesi',
          'Evlilik cüzdanı'
        ],
        importantNotes: [
          'Zorunlu değil ancak önerilir',
          'Daha hızlı ve ekonomik çözüm',
          'Gizlilik esasına dayanır'
        ],
        position: { x: 250, y: 50 },
        connections: ['step3', 'step4'],
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'Anlaşmalı Boşanma',
        shortTitle: 'Anlaşmalı',
        description: 'Tüm konularda anlaştıysanız, anlaşmalı boşanma davası açın. Tek avukat yeterlidir.',
        duration: '2-3 ay',
        participants: ['Avukat', 'Eşler', 'Hakim'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Anlaşma protokolü',
          'Mali durum belgeleri'
        ],
        importantNotes: [
          'Daha hızlı süreç',
          'Tek avukat yeterli',
          'Ekonomik çözüm'
        ],
        position: { x: 150, y: 200 },
        connections: ['step6'],
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Çekişmeli Boşanma',
        shortTitle: 'Çekişmeli',
        description: 'Anlaşmazlık durumunda çekişmeli boşanma davası açın. Her iki taraf ayrı avukat tutmalıdır.',
        duration: '6-18 ay',
        participants: ['2 Avukat', 'Eşler', 'Hakim'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Delil belgeleri',
          'Tanık listesi'
        ],
        importantNotes: [
          'Her taraf ayrı avukat',
          'Daha uzun süreç',
          'Masraflı olabilir'
        ],
        position: { x: 350, y: 200 },
        connections: ['step5'],
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Mahkeme Süreci',
        shortTitle: 'Mahkeme',
        description: 'Mahkemede duruşmalar yapılır. Deliller sunulur, tanıklar dinlenir ve hakim karar verir.',
        duration: '4-12 ay',
        participants: ['Hakim', 'Avukatlar', 'Eşler', 'Tanıklar'],
        requiredDocuments: [
          'Delil belgeleri',
          'Tanık ifadeleri',
          'Bilirkişi raporları'
        ],
        importantNotes: [
          'Delilleri zamanında sunun',
          'Duruşmalara katılın',
          'Avukatınızla iletişim halinde olun'
        ],
        position: { x: 350, y: 350 },
        connections: ['step6'],
        status: 'upcoming'
      },
      {
        id: 'step6',
        title: 'Karar ve Tescil',
        shortTitle: 'Karar',
        description: 'Mahkeme kararı kesinleşir ve boşanma nüfus müdürlüğünde tescil edilir.',
        duration: '1-2 hafta',
        participants: ['Nüfus Müdürlüğü', 'Taraflar'],
        requiredDocuments: [
          'Kesinleşmiş mahkeme kararı',
          'Kimlik belgesi',
          'Nüfus cüzdanı'
        ],
        importantNotes: [
          'Karar kesinleşene kadar bekleyin',
          'Tescil işlemini ihmal etmeyin',
          'Yeni kimlik belgeleri alın'
        ],
        position: { x: 250, y: 450 },
        connections: [],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'miras-sureci',
    title: 'Miras Süreci',
    description: 'Miras işlemleri ve veraset işlemleri',
    icon: 'Home',
    color: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    duration: '3-6 ay',
    difficulty: 'Kolay',
    totalSteps: 6,
    hasCalculator: false,
    category: 'hukuk',
    tags: ['miras', 'veraset', 'tapu', 'paylaşım'],
    estimatedCosts: {
      title: 'Miras İşlemleri Tahmini Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 2000, max: 15000, note: 'Anlaşmalı paylaşımda daha ucuz' },
        { name: 'Noter Masrafları', min: 500, max: 3000, note: 'Veraset ilamı ve paylaşım sözleşmesi' },
        { name: 'Mahkeme Harcı', min: 100, max: 1000, note: 'Miras davası açılırsa' },
        { name: 'Tapu Harcı', min: 200, max: 2000, note: 'Gayrimenkul devri için' },
        { name: 'Ekspertiz Ücreti', min: 0, max: 5000, note: 'Gayrimenkul değerleme gerekirse' },
        { name: 'Vergi ve Harçlar', min: 100, max: 1000, note: 'Devir işlemleri için' }
      ],
      totalRange: '2.900 - 27.000 TL',
      freeOptions: [
        'Anlaşmalı paylaşımda tek avukat yeterli',
        'Küçük meblağlar için noter yeterli olabilir',
        'Adli yardımdan yararlanabilirsiniz'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Ölüm İşlemleri',
        shortTitle: 'Ölüm Belgesi',
        description: 'Ölüm olayının tescili ve gerekli belgelerin alınması',
        duration: '1-2 gün',
        participants: ['Yakınlar', 'Nüfus Müdürlüğü'],
        requiredDocuments: [
          'Doktor raporu',
          'Kimlik belgesi',
          'Hastane belgesi'
        ],
        importantNotes: [
          '30 gün içinde başvuru yapın',
          'Malvarlığına dokunmayın',
          'Yakınları bilgilendirin'
        ],
        position: { x: 50, y: 50 },
        connections: ['step2'],
        status: 'active'
      },
      {
        id: 'step2',
        title: 'Mirasçı Tespiti',
        shortTitle: 'Mirasçılar',
        description: 'Yasal mirasçıların belirlenmesi ve vasiyetnamenin kontrolü',
        duration: '1-2 hafta',
        participants: ['Mirasçılar', 'Noterler'],
        requiredDocuments: [
          'Ölüm belgesi',
          'Nüfus kayıt örnekleri',
          'Vasiyetname (varsa)'
        ],
        importantNotes: [
          'Tüm mirasçıları belirleyin',
          'Vasiyetname araştırması yapın',
          'Miras paylarını hesaplayın'
        ],
        position: { x: 250, y: 50 },
        connections: ['step3'],
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'Terkin İşlemi',
        shortTitle: 'Terkin',
        description: 'Tapu müdürlüğünde miras sebebiyle intikalde terkin işlemi',
        duration: '1 hafta',
        participants: ['Tapu Müdürlüğü', 'Mirasçılar'],
        requiredDocuments: [
          'Ölüm belgesi',
          'Tapu senedi',
          'Mirasçı belgeleri'
        ],
        importantNotes: [
          'Tüm mirasçılar başvurmalı',
          'Tapu harçları ödenmelidir',
          'Veraset ilamı gerekebilir'
        ],
        position: { x: 450, y: 50 },
        connections: ['step4', 'step5'],
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Anlaşmalı Paylaşım',
        shortTitle: 'Anlaşma',
        description: 'Mirasçılar arası anlaşma ile paylaşım',
        duration: '2-4 hafta',
        participants: ['Mirasçılar', 'Noter'],
        requiredDocuments: [
          'Paylaşım sözleşmesi',
          'Kimlik belgesi',
          'Miras belgesi'
        ],
        importantNotes: [
          'Noterde imzalanmalıdır',
          'Tüm mirasçılar anlaşmalı',
          'Daha hızlı ve ekonomik'
        ],
        position: { x: 250, y: 200 },
        connections: ['step6'],
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Miras Davası',
        shortTitle: 'Dava',
        description: 'Anlaşmazlık durumunda mahkemede paylaşım davası',
        duration: '6-12 ay',
        participants: ['Hakim', 'Avukatlar', 'Mirasçılar'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Miras belgesi',
          'Değerleme raporları'
        ],
        importantNotes: [
          'Avukat tutun',
          'Tüm belgeleri hazırlayın',
          'Kayyım atanabilir'
        ],
        position: { x: 450, y: 200 },
        connections: ['step6'],
        status: 'upcoming'
      },
      {
        id: 'step6',
        title: 'Tescil ve Devir',
        shortTitle: 'Tescil',
        description: 'Malların yeni sahiplerine tescili ve devri',
        duration: '2-3 hafta',
        participants: ['Tapu Müdürlüğü', 'Bankalar', 'Mirasçılar'],
        requiredDocuments: [
          'Paylaşım sözleşmesi',
          'Kimlik belgesi',
          'Vergi borcu belgesi'
        ],
        importantNotes: [
          'Vergi borçlarını ödeyin',
          'Tüm devir işlemlerini yapın',
          'Yeni belgeleri alın'
        ],
        position: { x: 350, y: 350 },
        connections: [],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'is-davasi-sureci',
    title: 'İş Davası Süreci',
    description: 'İşçi hakları ve iş mahkemesi süreçleri',
    icon: 'Briefcase',
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    duration: '6-12 ay',
    difficulty: 'Orta',
    totalSteps: 5,
    hasCalculator: true,
    calculatorType: 'compensation',
    category: 'hukuk',
    tags: ['işçi hakları', 'tazminat', 'iş kanunu', 'mahkeme'],
    estimatedCosts: {
      title: 'İş Davası Tahmini Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 0, max: 10000, note: 'İş mahkemelerinde vekalet ücreti muafiyeti var' },
        { name: 'Dava Harcı', min: 0, max: 0, note: 'İş davalarında harç muafiyeti' },
        { name: 'Arabuluculuk', min: 0, max: 0, note: 'Zorunlu ve ücretsiz' },
        { name: 'İcra Masrafları', min: 50, max: 500, note: 'İcra takibinde masraflar' },
        { name: 'Ekspertiz Ücreti', min: 0, max: 2000, note: 'Bilirkişi gerekirse' },
        { name: 'Temyiz Masrafları', min: 0, max: 1000, note: 'Yargıtay başvurusu' }
      ],
      totalRange: '50 - 13.500 TL',
      freeOptions: [
        'İş davalarında harç muafiyeti var',
        'Arabuluculuk zorunlu ve ücretsiz',
        'Bazı avukatlar başarı ücreti alır',
        'Adli yardımdan yararlanabilirsiniz'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'İş Sona Erme',
        shortTitle: 'İşten Çıkış',
        description: 'İş sözleşmesinin sona ermesi ve alacakların hesaplanması',
        duration: '1 hafta',
        participants: ['İşçi', 'İşveren', 'İK Departmanı'],
        requiredDocuments: [
          'İş sözleşmesi',
          'Bordro örnekleri',
          'İşten çıkış belgesi'
        ],
        importantNotes: [
          'Tüm belgelerinizi saklayın',
          'Alacaklarınızı hesaplayın',
          'Fesih gerekçesini öğrenin'
        ],
        position: { x: 50, y: 50 },
        connections: ['step2'],
        status: 'active'
      },
      {
        id: 'step2',
        title: 'Arabuluculuk',
        shortTitle: 'Arabuluculuk',
        description: 'Zorunlu arabuluculuk süreci (6 hafta)',
        duration: '6 hafta',
        participants: ['Arabulucu', 'İşçi', 'İşveren'],
        requiredDocuments: [
          'Arabuluculuk başvuru formu',
          'Çalışma belgeleri',
          'Alacak hesap cetveli'
        ],
        importantNotes: [
          'Dava öncesi zorunludur',
          'Ücretsiz hizmettir',
          'Anlaşma olabilir'
        ],
        position: { x: 250, y: 50 },
        connections: ['step3', 'step4'],
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'İcra Takibi',
        shortTitle: 'İcra',
        description: 'Alacaklar için icra müdürlüğüne başvuru',
        duration: '2-3 ay',
        participants: ['İcra Müdürlüğü', 'İşçi', 'İşveren'],
        requiredDocuments: [
          'İcra takip talep formu',
          'Çalışma belgeleri',
          'Alacak hesabı'
        ],
        importantNotes: [
          'Hızlı ve ekonomik yol',
          'İtiraz edilebilir',
          'Mal varlığı araştırması yapın'
        ],
        position: { x: 150, y: 200 },
        connections: ['step4'],
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'İş Mahkemesi',
        shortTitle: 'Mahkeme',
        description: 'İş mahkemesinde dava süreci',
        duration: '6-12 ay',
        participants: ['Hakim', 'İşçi', 'İşveren', 'Avukatlar'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Çalışma belgeleri',
          'Tanık listesi'
        ],
        importantNotes: [
          'Harçsız ve ücretsizdir',
          'Avukat tutabilirsiniz',
          'Delilleri zamanında sunun'
        ],
        position: { x: 350, y: 200 },
        connections: ['step5'],
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Karar ve İcra',
        shortTitle: 'İcra',
        description: 'Mahkeme kararının kesinleşmesi ve icra edilmesi',
        duration: '1-3 ay',
        participants: ['İcra Müdürlüğü', 'İşçi', 'İşveren'],
        requiredDocuments: [
          'Kesinleşmiş mahkeme kararı',
          'İcra takip belgesi',
          'Banka hesap bilgileri'
        ],
        importantNotes: [
          'Temyiz süresi bekleyin',
          'İcra takibi başlatın',
          'Haciz işlemleri yapılabilir'
        ],
        position: { x: 250, y: 350 },
        connections: [],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'ceza-yargisi-sureci',
    title: 'Ceza Yargılaması Süreci',
    description: 'Ceza davası süreci ve haklarınız',
    icon: 'Scale',
    color: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    duration: '1-2 yıl',
    difficulty: 'Zor',
    totalSteps: 7,
    hasCalculator: true,
    calculatorType: 'sentence',
    category: 'ceza',
    tags: ['ceza hukuku', 'mahkeme', 'suç', 'yargılama'],
    estimatedCosts: {
      title: 'Ceza Davası Tahmini Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 3000, max: 50000, note: 'Suçun ağırlığına göre değişir' },
        { name: 'Bilirkişi Ücreti', min: 0, max: 10000, note: 'Teknik konularda gerekebilir' },
        { name: 'Tercüman Ücreti', min: 0, max: 2000, note: 'Yabancı dilde belge varsa' },
        { name: 'Keşif Masrafları', min: 0, max: 5000, note: 'Olay yeri incelemesi gerekirse' },
        { name: 'Tebligat Giderleri', min: 100, max: 1000, note: 'Çok taraflı davalarda' },
        { name: 'Temyiz Masrafları', min: 0, max: 3000, note: 'Yargıtay başvurusu' }
      ],
      totalRange: '3.100 - 71.000 TL',
      freeOptions: [
        'Müşteki için dava harçsız',
        'Adli yardımdan yararlanabilirsiniz',
        'Baro adli yardım avukatı atayabilir',
        'Devlet bilirkişiliği ücretsiz olabilir'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Suç İhbarı',
        shortTitle: 'İhbar',
        description: 'Suç ihbarı veya şikayetin yapılması',
        duration: '1 gün',
        participants: ['Mağdur', 'Polis', 'Savcılık'],
        requiredDocuments: [
          'Kimlik belgesi',
          'Şikayet dilekçesi',
          'Delil belgeleri'
        ],
        importantNotes: [
          'Tüm delilleri saklayın',
          'Detaylı şikayet yazın',
          'Tanık bilgilerini verin'
        ],
        position: { x: 50, y: 50 },
        connections: ['step2'],
        status: 'active'
      },
      {
        id: 'step2',
        title: 'Soruşturma',
        shortTitle: 'Soruşturma',
        description: 'Cumhuriyet Savcılığı tarafından soruşturma',
        duration: '6 ay',
        participants: ['Savcı', 'Polis', 'Şüpheli', 'Mağdur'],
        requiredDocuments: [
          'İfade tutanakları',
          'Delil toplama',
          'Bilirkişi raporları'
        ],
        importantNotes: [
          'Gizli soruşturmadır',
          'Avukat hakkınız vardır',
          'İfade verme zorunluluğu yok'
        ],
        position: { x: 250, y: 50 },
        connections: ['step3', 'step4'],
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'İddianame',
        shortTitle: 'İddianame',
        description: 'Savcının iddianame düzenlemesi',
        duration: '2-4 hafta',
        participants: ['Savcı', 'Mahkeme'],
        requiredDocuments: [
          'İddianame',
          'Soruşturma dosyası',
          'Delil listesi'
        ],
        importantNotes: [
          'Suçlama kesinleşir',
          'Mahkeme süreci başlar',
          'Müdafi seçme hakkı'
        ],
        position: { x: 150, y: 200 },
        connections: ['step5'],
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Kovuşturmama',
        shortTitle: 'Kovuşturmama',
        description: 'Yeterli delil yoksa kovuşturmama kararı',
        duration: '2 hafta',
        participants: ['Savcı', 'Mağdur'],
        requiredDocuments: [
          'Kovuşturmama kararı',
          'İtiraz dilekçesi (varsa)'
        ],
        importantNotes: [
          'Karara itiraz edilebilir',
          'Başka savcı inceler',
          'Yeni delil sunulabilir'
        ],
        position: { x: 450, y: 200 },
        connections: [],
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Mahkeme Süreci',
        shortTitle: 'Duruşma',
        description: 'Mahkemede aleni duruşma yapılması',
        duration: '6-12 ay',
        participants: ['Hakim', 'Sanık', 'Müşteki', 'Avukatlar'],
        requiredDocuments: [
          'Duruşma tutanakları',
          'Delil sunumu',
          'Tanık ifadeleri'
        ],
        importantNotes: [
          'Aleni duruşmadır',
          'Susma hakkınız vardır',
          'Müdafi bulundurabilirsiniz'
        ],
        position: { x: 150, y: 350 },
        connections: ['step6', 'step7'],
        status: 'upcoming'
      },
      {
        id: 'step6',
        title: 'Beraat Kararı',
        shortTitle: 'Beraat',
        description: 'Suçun sabit olmaması durumunda beraat',
        duration: '2 hafta',
        participants: ['Mahkeme', 'Sanık'],
        requiredDocuments: [
          'Beraat kararı',
          'Temyiz dilekçesi (varsa)'
        ],
        importantNotes: [
          'Sanık aklanmış olur',
          'Savcı temyiz edebilir',
          'Kişilik hakları korunur'
        ],
        position: { x: 50, y: 500 },
        connections: [],
        status: 'upcoming'
      },
      {
        id: 'step7',
        title: 'Mahkumiyet',
        shortTitle: 'Mahkumiyet',
        description: 'Suçun sabit olması durumunda ceza verilmesi',
        duration: '1 ay',
        participants: ['Mahkeme', 'Sanık', 'İnfaz Kurumu'],
        requiredDocuments: [
          'Mahkumiyet kararı',
          'Temyiz dilekçesi (varsa)',
          'İnfaz belgesi'
        ],
        importantNotes: [
          'Temyiz edilebilir',
          'Ceza türü belirlenir',
          'İnfaz süreci başlar'
        ],
        position: { x: 250, y: 500 },
        connections: [],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'icra-takibi',
    title: 'İcra Takibi Süreci',
    description: 'Alacak tahsili için icra takibi süreci',
    icon: 'DollarSign',
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    duration: '2-6 ay',
    difficulty: 'Orta',
    totalSteps: 4,
    hasCalculator: false,
    category: 'hukuk',
    tags: ['icra', 'alacak', 'borç', 'tahsil'],
    estimatedCosts: {
      title: 'İcra Takibi Tahmini Masrafları',
      items: [
        { name: 'İcra Harcı', min: 50, max: 500, note: 'Alacak miktarına göre değişir' },
        { name: 'Tebligat Gideri', min: 30, max: 100, note: 'Her tebligat için' },
        { name: 'Haciz Masrafları', min: 100, max: 1000, note: 'Haciz işlemi varsa' },
        { name: 'Ekspertiz Ücreti', min: 0, max: 2000, note: 'Mal değerlemesi gerekirse' }
      ],
      totalRange: '180 - 3.600 TL',
      freeOptions: [
        'Küçük alacaklar için uygun maliyetli',
        'Avukat tutmak zorunlu değil',
        'Online başvuru imkanı var'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Alacak Belirleme',
        shortTitle: 'Alacak Belirleme',
        description: 'Tahsil edilecek alacak miktarını belirleyin. Borçlu ile iletişim kurarak ödeme talep edin.',
        duration: '1 hafta',
        participants: ['Alacaklı', 'Borçlu'],
        requiredDocuments: [
          'Alacak belgesi',
          'Sözleşme',
          'Fatura',
          'Makbuz'
        ],
        importantNotes: [
          'Alacak miktarını netleştirin',
          'Faiz hesaplaması yapın',
          'Vade tarihini kontrol edin',
          'Yazılı talep gönderin'
        ],
        position: { x: 50, y: 50 },
        status: 'completed'
      },
      {
        id: 'step2',
        title: 'İcra Müdürlüğü Başvurusu',
        shortTitle: 'İcra Başvurusu',
        description: 'İcra müdürlüğüne başvuru yapın. Gerekli belgeleri sunun ve takip ücretini ödeyin.',
        duration: '1 gün',
        participants: ['Alacaklı', 'İcra Müdürlüğü'],
        requiredDocuments: [
          'İcra takip talep formu',
          'Alacak belgesi',
          'Kimlik belgesi',
          'İcra harcı makbuzu'
        ],
        importantNotes: [
          'Formu eksiksiz doldurun',
          'İcra harcını ödeyin',
          'Tebligat adresini verin',
          'Başvuru numarasını alın'
        ],
        position: { x: 150, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'Tebligat ve İtiraz Süreci',
        shortTitle: 'Tebligat',
        description: 'Borçluya tebligat gönderilir. İtiraz etmezse takip devam eder, itiraz ederse mahkeme süreci başlar.',
        duration: '2-4 hafta',
        participants: ['Borçlu', 'İcra Müdürlüğü', 'Mahkeme'],
        requiredDocuments: [
          'Tebligat belgesi',
          'İtiraz dilekçesi',
          'Mahkeme kararı',
          'Takip belgesi'
        ],
        importantNotes: [
          'Tebligat süresini takip edin',
          'İtiraz varsa mahkemeye gidin',
          'İtiraz yoksa haciz başlatın',
          'Süreleri kaçırmayın'
        ],
        position: { x: 250, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Haciz ve Tahsil',
        shortTitle: 'Haciz',
        description: 'Borçlunun malları haczedilir ve satışa çıkarılır. Elde edilen para alacaklıya ödenir.',
        duration: '1-3 ay',
        participants: ['İcra Müdürlüğü', 'Ekspertiz', 'Alacaklı'],
        requiredDocuments: [
          'Haciz kararı',
          'Ekspertiz raporu',
          'Satış belgesi',
          'Ödeme makbuzu'
        ],
        importantNotes: [
          'Haciz sürecini takip edin',
          'Ekspertiz raporunu inceleyin',
          'Satış tarihini öğrenin',
          'Ödemeyi alın'
        ],
        position: { x: 350, y: 50 },
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'nafaka-davasi',
    title: 'Nafaka Davası Süreci',
    description: 'Çocuk ve eş nafakası dava süreci',
    icon: 'Baby',
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600',
    duration: '3-8 ay',
    difficulty: 'Orta',
    totalSteps: 5,
    hasCalculator: false,
    category: 'hukuk',
    tags: ['nafaka', 'çocuk', 'eş', 'aile hukuku'],
    estimatedCosts: {
      title: 'Nafaka Davası Tahmini Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 2000, max: 10000, note: 'Davanın karmaşıklığına göre' },
        { name: 'Dava Harcı', min: 100, max: 300, note: 'Talep edilen nafaka miktarına göre' },
        { name: 'Bilirkişi Ücreti', min: 0, max: 3000, note: 'Gelir tespiti gerekirse' }
      ],
      totalRange: '2.100 - 13.300 TL',
      freeOptions: [
        'Adli yardımdan yararlanabilirsiniz',
        'Çocuk nafakası davalarında öncelik var',
        'Geçici nafaka kararı alınabilir'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Hukuki Danışmanlık',
        shortTitle: 'Danışmanlık',
        description: 'Nafaka davası hakkında bilgi almak için bir avukatla görüşün. Haklarınızı ve süreci öğrenin.',
        duration: '1-2 saat',
        participants: ['Avukat', 'Danışan'],
        requiredDocuments: [
          'Kimlik belgesi',
          'Gelir belgesi',
          'Çocuk nüfus cüzdanı',
          'Evlilik cüzdanı'
        ],
        importantNotes: [
          'Nafaka türünü belirleyin',
          'Gelir durumunu değerlendirin',
          'Çocuk yaşını kontrol edin',
          'Mali durumu belgeleyin'
        ],
        position: { x: 50, y: 50 },
        status: 'completed'
      },
      {
        id: 'step2',
        title: 'Belge Toplama',
        shortTitle: 'Belge Toplama',
        description: 'Nafaka davası için gerekli tüm belgeleri toplayın. Gelir, gider ve çocuk masraflarını belgeleyin.',
        duration: '1-2 hafta',
        participants: ['Danışan', 'Avukat'],
        requiredDocuments: [
          'Gelir belgesi',
          'Gider belgeleri',
          'Çocuk masraf belgeleri',
          'Kira sözleşmesi'
        ],
        importantNotes: [
          'Tüm faturaları saklayın',
          'Gelir belgelerini güncelleyin',
          'Çocuk masraflarını belgeleyin',
          'Kira ve diğer giderleri kaydedin'
        ],
        position: { x: 150, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'Dava Dilekçesi Hazırlama',
        shortTitle: 'Dilekçe Hazırlama',
        description: 'Nafaka davası dilekçesi hazırlanır. Talep edilen nafaka miktarı ve gerekçeleri belirlenir.',
        duration: '1 hafta',
        participants: ['Avukat'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Gelir belgesi',
          'Gider belgeleri',
          'Çocuk masraf hesaplaması'
        ],
        importantNotes: [
          'Nafaka miktarını hesaplayın',
          'Gerekçeleri güçlendirin',
          'Delilleri sıralayın',
          'Dilekçeyi imzalayın'
        ],
        position: { x: 250, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Mahkeme Süreci',
        shortTitle: 'Mahkeme',
        description: 'Duruşmalar yapılır, deliller sunulur. Bilirkişi raporu alınır ve nafaka miktarı belirlenir.',
        duration: '2-6 ay',
        participants: ['Hakim', 'Avukat', 'Bilirkişi'],
        requiredDocuments: [
          'Duruşma tutanakları',
          'Bilirkişi raporu',
          'Gelir-gider hesaplaması',
          'Çocuk masraf belgeleri'
        ],
        importantNotes: [
          'Duruşmalara katılın',
          'Delilleri sunun',
          'Bilirkişi raporunu inceleyin',
          'Hakimi ikna edin'
        ],
        position: { x: 350, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Karar ve Nafaka Ödemesi',
        shortTitle: 'Karar',
        description: 'Mahkeme nafaka miktarını belirler. Ödeme süreci başlar ve takip edilir.',
        duration: '1 ay',
        participants: ['Hakim', 'Avukat', 'Nafaka Ödeyen'],
        requiredDocuments: [
          'Mahkeme kararı',
          'Nafaka hesabı',
          'Ödeme belgesi',
          'İcra takip belgesi'
        ],
        importantNotes: [
          'Kararı inceleyin',
          'Temyiz süresi 2 hafta',
          'Nafakayı takip edin',
          'İcra gerekirse başlatın'
        ],
        position: { x: 450, y: 50 },
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'trafik-tazminat',
    title: 'Trafik Tazminat Davası',
    description: 'Trafik kazası sonrası tazminat süreci',
    icon: 'Car',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
    duration: '6-18 ay',
    difficulty: 'Zor',
    totalSteps: 6,
    hasCalculator: false,
    category: 'hukuk',
    tags: ['trafik', 'kaza', 'tazminat', 'sigorta'],
    estimatedCosts: {
      title: 'Trafik Tazminat Davası Masrafları',
      items: [
        { name: 'Avukat Ücreti', min: 3000, max: 20000, note: 'Zarar miktarına göre değişir' },
        { name: 'Bilirkişi Ücreti', min: 1000, max: 5000, note: 'Tıbbi rapor ve ekspertiz' },
        { name: 'Dava Harcı', min: 200, max: 800, note: 'Talep edilen tazminat miktarına göre' }
      ],
      totalRange: '4.200 - 25.800 TL',
      freeOptions: [
        'Başarı ücreti alan avukatlar var',
        'Sigorta şirketi ödeyebilir',
        'Adli yardım başvurusu yapılabilir'
      ]
    },
    steps: [
      {
        id: 'step1',
        title: 'Hukuki Danışmanlık',
        shortTitle: 'Danışmanlık',
        description: 'Trafik kazası sonrası haklarınızı öğrenmek için bir avukatla görüşün. Zarar tespiti ve tazminat miktarı hakkında bilgi alın.',
        duration: '1-2 saat',
        participants: ['Avukat', 'Kaza Mağduru'],
        requiredDocuments: [
          'Kaza tutanağı',
          'Trafik sigortası poliçesi',
          'Kimlik belgesi',
          'Araç ruhsatı'
        ],
        importantNotes: [
          'Kaza tutanağını mutlaka alın',
          'Fotoğraf ve video çekin',
          'Tanık bilgilerini toplayın',
          'Sigorta şirketini bilgilendirin'
        ],
        position: { x: 50, y: 50 },
        status: 'completed'
      },
      {
        id: 'step2',
        title: 'Zarar Tespiti',
        shortTitle: 'Zarar Tespiti',
        description: 'Araç hasarı, yaralanma ve maddi zararların tespiti yapılır. Bilirkişi raporu alınır.',
        duration: '2-4 hafta',
        participants: ['Bilirkişi', 'Sigorta Eksperi', 'Avukat'],
        requiredDocuments: [
          'Araç hasar fotoğrafları',
          'Hastane raporları',
          'Fatura ve makbuzlar',
          'Gelir belgesi'
        ],
        importantNotes: [
          'Tüm belgeleri saklayın',
          'Zarar fotoğrafları çekin',
          'Hastane masraflarını belgeleyin',
          'İş kaybı varsa belgeleyin'
        ],
        position: { x: 150, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step3',
        title: 'Sigorta Şirketi ile Görüşme',
        shortTitle: 'Sigorta Görüşmesi',
        description: 'Sigorta şirketi ile tazminat miktarı konusunda görüşme yapılır. Anlaşma sağlanmaya çalışılır.',
        duration: '1-2 hafta',
        participants: ['Sigorta Eksperi', 'Avukat', 'Mağdur'],
        requiredDocuments: [
          'Bilirkişi raporu',
          'Hastane belgeleri',
          'Gelir belgesi',
          'Zarar hesaplaması'
        ],
        importantNotes: [
          'Sigorta teklifini dikkatli inceleyin',
          'Yetersizse reddedin',
          'Avukatınızla görüşün',
          'Yazılı teklif alın'
        ],
        position: { x: 250, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step4',
        title: 'Dava Açma',
        shortTitle: 'Dava Açma',
        description: 'Sigorta şirketi ile anlaşma sağlanamazsa tazminat davası açılır. Mahkemeye dilekçe sunulur.',
        duration: '1-2 hafta',
        participants: ['Avukat', 'Mahkeme'],
        requiredDocuments: [
          'Dava dilekçesi',
          'Bilirkişi raporu',
          'Tüm zarar belgeleri',
          'Kimlik belgesi'
        ],
        importantNotes: [
          'Dava süresi 2 yıldır',
          'Dilekçe ücreti ödenir',
          'Tüm belgeler eklenir',
          'Tebligat adresi verilir'
        ],
        position: { x: 350, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step5',
        title: 'Mahkeme Süreci',
        shortTitle: 'Mahkeme',
        description: 'Duruşmalar yapılır, deliller sunulur. Bilirkişi raporu ve tanık ifadeleri alınır.',
        duration: '6-12 ay',
        participants: ['Hakim', 'Avukat', 'Bilirkişi', 'Tanıklar'],
        requiredDocuments: [
          'Duruşma tutanakları',
          'Bilirkişi raporu',
          'Tanık ifadeleri',
          'Delil belgeleri'
        ],
        importantNotes: [
          'Duruşmalara katılın',
          'Tanık hazırlayın',
          'Delilleri sunun',
          'Hakimi ikna edin'
        ],
        position: { x: 450, y: 50 },
        status: 'upcoming'
      },
      {
        id: 'step6',
        title: 'Karar ve Tazminat',
        shortTitle: 'Karar',
        description: 'Mahkeme karar verir. Tazminat miktarı belirlenir ve ödeme süreci başlar.',
        duration: '1-2 ay',
        participants: ['Hakim', 'Avukat', 'Sigorta Şirketi'],
        requiredDocuments: [
          'Mahkeme kararı',
          'Tazminat hesabı',
          'Ödeme belgesi',
          'İcra takip belgesi'
        ],
        importantNotes: [
          'Kararı inceleyin',
          'Temyiz süresi 2 hafta',
          'Tazminatı alın',
          'İcra gerekirse başlatın'
        ],
        position: { x: 550, y: 50 },
        status: 'upcoming'
      }
    ]
  }
];

// Calculator configurations for admin panel
export const calculatorConfigs = {
  compensation: {
    title: 'Tazminat Hesaplama Aracı',
    description: 'İş Kanunu\'na göre kıdem, ihbar ve diğer tazminatları hesaplayın',
    parameters: {
      minimumWage: { value: 17002, label: 'Asgari Ücret (2024)', unit: 'TL' },
      severanceMultiplier: { value: 30, label: 'Kıdem Tazminatı Çarpanı', unit: 'gün' },
      noticeMultiplier: { value: 15, label: 'İhbar Tazminatı Çarpanı', unit: 'gün' },
      overtimeRate: { value: 1.5, label: 'Fazla Mesai Çarpanı', unit: 'kat' },
      maxSeveranceCap: { value: 26061.86, label: 'Kıdem Tazminatı Tavanı', unit: 'TL' }
    }
  },
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

export const processIcons = {
  Heart: '💔',
  Home: '🏠', 
  Briefcase: '💼',
  Scale: '⚖️',
  DollarSign: '💰',
  Baby: '👶',
  Car: '🚗'
};

// Mock Blog Posts
export const mockBlogPosts = [
  {
    id: 1,
    title: 'Boşanma Sürecinde Dikkat Edilmesi Gerekenler',
    excerpt: 'Boşanma sürecinde haklarınızı korumak için bilmeniz gereken önemli noktalar.',
    content: 'Boşanma süreci, hem duygusal hem de hukuki açıdan karmaşık bir süreçtir. Bu süreçte haklarınızı korumak ve doğru adımları atmak çok önemlidir. İşte dikkat edilmesi gereken temel noktalar...',
    author: 'Av. Mehmet Yılmaz',
    publishDate: '2024-01-15',
    category: 'Aile Hukuku',
    tags: ['boşanma', 'aile hukuku', 'haklar'],
    image: '/images/blog/divorce-process.jpg',
    readTime: '5 dk',
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: 'İşçi Hakları ve Tazminat Hesaplama',
    excerpt: 'İş Kanunu kapsamında işçi hakları ve tazminat hesaplama yöntemleri.',
    content: 'İşçi hakları, çalışma hayatının temel taşlarından biridir. İş Kanunu, işçilerin haklarını korumak için kapsamlı düzenlemeler içerir. Kıdem tazminatı, ihbar tazminatı ve fazla mesai ücreti gibi konularda bilgi sahibi olmak önemlidir...',
    author: 'Av. Ayşe Demir',
    publishDate: '2024-01-10',
    category: 'İş Hukuku',
    tags: ['işçi hakları', 'tazminat', 'iş kanunu'],
    image: '/images/blog/worker-rights.jpg',
    readTime: '7 dk',
    views: 2100,
    likes: 156
  },
  {
    id: 3,
    title: 'Miras Hukuku ve Veraset İşlemleri',
    excerpt: 'Miras hukuku kapsamında veraset işlemleri ve dikkat edilmesi gerekenler.',
    content: 'Miras hukuku, kişinin ölümü sonrasında malvarlığının mirasçılara geçişini düzenleyen hukuk dalıdır. Veraset işlemleri sırasında dikkat edilmesi gereken önemli noktalar vardır...',
    author: 'Av. Fatma Kaya',
    publishDate: '2024-01-05',
    category: 'Miras Hukuku',
    tags: ['miras', 'veraset', 'mal paylaşımı'],
    image: '/images/blog/inheritance-law.jpg',
    readTime: '6 dk',
    views: 1800,
    likes: 134
  },
  {
    id: 4,
    title: 'Ceza Hukukunda Savunma Hakkı',
    excerpt: 'Ceza davalarında savunma hakkı ve avukat seçimi konularında bilinmesi gerekenler.',
    content: 'Ceza hukukunda savunma hakkı, anayasal bir haktır. Bu hak, sanığın kendisini savunma ve avukat bulundurma hakkını içerir. Savunma hakkının doğru kullanılması, adil yargılanma için kritik öneme sahiptir...',
    author: 'Av. Ali Özkan',
    publishDate: '2024-01-01',
    category: 'Ceza Hukuku',
    tags: ['ceza hukuku', 'savunma hakkı', 'avukat'],
    image: '/images/blog/criminal-defense.jpg',
    readTime: '8 dk',
    views: 1650,
    likes: 98
  },
  {
    id: 5,
    title: 'İcra ve İflas Hukuku Rehberi',
    excerpt: 'Alacak tahsili için icra takibi süreci ve iflas hukuku hakkında temel bilgiler.',
    content: 'İcra ve iflas hukuku, alacakların tahsili ve borçlunun malvarlığının tasfiyesi konularını düzenler. İcra takibi süreci, alacaklılar için önemli bir hukuki araçtır...',
    author: 'Av. Zeynep Arslan',
    publishDate: '2023-12-28',
    category: 'İcra Hukuku',
    tags: ['icra', 'alacak tahsili', 'iflas'],
    image: '/images/blog/execution-law.jpg',
    readTime: '6 dk',
    views: 1420,
    likes: 112
  },
  {
    id: 6,
    title: 'Trafik Kazası Sonrası Hukuki Süreç',
    excerpt: 'Trafik kazası sonrası tazminat davası ve sigorta süreçleri hakkında bilgiler.',
    content: 'Trafik kazaları sonrasında mağdurların hakları ve tazminat alma süreçleri önemli konulardır. Sigorta şirketleri ile olan ilişkiler ve mahkeme süreçleri dikkatli takip edilmelidir...',
    author: 'Av. Can Yıldız',
    publishDate: '2023-12-25',
    category: 'Trafik Hukuku',
    tags: ['trafik kazası', 'tazminat', 'sigorta'],
    image: '/images/blog/traffic-accident.jpg',
    readTime: '5 dk',
    views: 1950,
    likes: 145
  }
];

// Mock Yargıtay Kararları
export const mockSupremeCourtDecisions = [
  {
    id: 1,
    caseNumber: '2024/1234',
    decisionDate: '2024-01-15',
    chamber: '2. Hukuk Dairesi',
    subject: 'Boşanma Davasında Mal Paylaşımı',
    summary: 'Evlilik birliği içinde edinilen malların eşit paylaşımı ilkesi uygulanmalıdır.',
    fullText: 'Yargıtay 2. Hukuk Dairesi, boşanma davasında mal paylaşımı konusunda önemli bir karar verdi. Karara göre, evlilik birliği içinde edinilen malların eşit paylaşımı ilkesi uygulanmalıdır...',
    keywords: ['boşanma', 'mal paylaşımı', 'evlilik birliği'],
    category: 'Aile Hukuku',
    importance: 'Yüksek',
    views: 3200,
    downloads: 450
  },
  {
    id: 2,
    caseNumber: '2024/5678',
    decisionDate: '2024-01-10',
    chamber: '9. Hukuk Dairesi',
    subject: 'İşçi Tazminatı Hesaplama',
    summary: 'Kıdem tazminatı hesaplanırken son ücret dikkate alınmalıdır.',
    fullText: 'Yargıtay 9. Hukuk Dairesi, işçi tazminatı hesaplama konusunda net bir karar verdi. Karara göre, kıdem tazminatı hesaplanırken işçinin son ücreti dikkate alınmalıdır...',
    keywords: ['işçi tazminatı', 'kıdem tazminatı', 'ücret'],
    category: 'İş Hukuku',
    importance: 'Orta',
    views: 2800,
    downloads: 380
  },
  {
    id: 3,
    caseNumber: '2024/9012',
    decisionDate: '2024-01-05',
    chamber: '3. Hukuk Dairesi',
    subject: 'Miras Hukuku ve Vasiyetname',
    summary: 'Vasiyetname geçersizse yasal mirasçılar mirastan yararlanır.',
    fullText: 'Yargıtay 3. Hukuk Dairesi, miras hukuku konusunda önemli bir karar verdi. Karara göre, vasiyetname geçersizse yasal mirasçılar mirastan yararlanır...',
    keywords: ['miras', 'vasiyetname', 'yasal mirasçı'],
    category: 'Miras Hukuku',
    importance: 'Yüksek',
    views: 2100,
    downloads: 290
  },
  {
    id: 4,
    caseNumber: '2024/3456',
    decisionDate: '2024-01-01',
    chamber: '1. Ceza Dairesi',
    subject: 'Ceza Hukukunda Delil Değerlendirmesi',
    summary: 'Delillerin değerlendirilmesinde makul şüphe ilkesi uygulanmalıdır.',
    fullText: 'Yargıtay 1. Ceza Dairesi, ceza hukukunda delil değerlendirmesi konusunda önemli bir karar verdi. Karara göre, delillerin değerlendirilmesinde makul şüphe ilkesi uygulanmalıdır...',
    keywords: ['ceza hukuku', 'delil', 'makul şüphe'],
    category: 'Ceza Hukuku',
    importance: 'Yüksek',
    views: 3500,
    downloads: 520
  },
  {
    id: 5,
    caseNumber: '2023/7890',
    decisionDate: '2023-12-28',
    chamber: '4. Hukuk Dairesi',
    subject: 'İcra Takibi ve İtiraz',
    summary: 'İcra takibine itiraz süresi içinde yapılmalıdır.',
    fullText: 'Yargıtay 4. Hukuk Dairesi, icra takibi konusunda net bir karar verdi. Karara göre, icra takibine itiraz süresi içinde yapılmalıdır...',
    keywords: ['icra takibi', 'itiraz', 'süre'],
    category: 'İcra Hukuku',
    importance: 'Orta',
    views: 1800,
    downloads: 240
  },
  {
    id: 6,
    caseNumber: '2023/2468',
    decisionDate: '2023-12-25',
    chamber: '8. Hukuk Dairesi',
    subject: 'Trafik Kazası ve Tazminat',
    summary: 'Trafik kazasında kusur oranı tazminat miktarını etkiler.',
    fullText: 'Yargıtay 8. Hukuk Dairesi, trafik kazası tazminatı konusunda önemli bir karar verdi. Karara göre, trafik kazasında kusur oranı tazminat miktarını etkiler...',
    keywords: ['trafik kazası', 'tazminat', 'kusur oranı'],
    category: 'Trafik Hukuku',
    importance: 'Orta',
    views: 2200,
    downloads: 310
  },
  {
    id: 7,
    caseNumber: '2023/1357',
    decisionDate: '2023-12-20',
    chamber: '6. Hukuk Dairesi',
    subject: 'Nafaka ve Çocuk Velayeti',
    summary: 'Çocuk velayeti kararında çocuğun yararı öncelikli olmalıdır.',
    fullText: 'Yargıtay 6. Hukuk Dairesi, çocuk velayeti konusunda önemli bir karar verdi. Karara göre, çocuk velayeti kararında çocuğun yararı öncelikli olmalıdır...',
    keywords: ['nafaka', 'çocuk velayeti', 'çocuğun yararı'],
    category: 'Aile Hukuku',
    importance: 'Yüksek',
    views: 2900,
    downloads: 420
  },
  {
    id: 8,
    caseNumber: '2023/9753',
    decisionDate: '2023-12-15',
    chamber: '5. Hukuk Dairesi',
    subject: 'Sözleşme Hukuku ve İfa',
    summary: 'Sözleşme ifasında dürüstlük kuralı uygulanmalıdır.',
    fullText: 'Yargıtay 5. Hukuk Dairesi, sözleşme hukuku konusunda önemli bir karar verdi. Karara göre, sözleşme ifasında dürüstlük kuralı uygulanmalıdır...',
    keywords: ['sözleşme', 'ifa', 'dürüstlük kuralı'],
    category: 'Borçlar Hukuku',
    importance: 'Orta',
    views: 1600,
    downloads: 200
  },
  {
    id: 9,
    caseNumber: '2023/8642',
    decisionDate: '2023-12-10',
    chamber: '7. Hukuk Dairesi',
    subject: 'Gayrimenkul Hukuku ve Tapu',
    summary: 'Tapu kaydındaki hatalar düzeltilebilir.',
    fullText: 'Yargıtay 7. Hukuk Dairesi, gayrimenkul hukuku konusunda önemli bir karar verdi. Karara göre, tapu kaydındaki hatalar düzeltilebilir...',
    keywords: ['gayrimenkul', 'tapu', 'kayıt hatası'],
    category: 'Gayrimenkul Hukuku',
    importance: 'Orta',
    views: 1900,
    downloads: 280
  },
  {
    id: 10,
    caseNumber: '2023/7531',
    decisionDate: '2023-12-05',
    chamber: '10. Hukuk Dairesi',
    subject: 'Ticaret Hukuku ve Şirket',
    summary: 'Şirket ortaklarının sorumluluğu sınırlıdır.',
    fullText: 'Yargıtay 10. Hukuk Dairesi, ticaret hukuku konusunda önemli bir karar verdi. Karara göre, şirket ortaklarının sorumluluğu sınırlıdır...',
    keywords: ['ticaret hukuku', 'şirket', 'ortak sorumluluğu'],
    category: 'Ticaret Hukuku',
    importance: 'Orta',
    views: 1700,
    downloads: 230
  },
  {
    id: 11,
    caseNumber: '2023/6420',
    decisionDate: '2023-11-30',
    chamber: '11. Hukuk Dairesi',
    subject: 'İdare Hukuku ve Kamu Görevlisi',
    summary: 'Kamu görevlisinin disiplin cezası usulüne uygun verilmelidir.',
    fullText: 'Yargıtay 11. Hukuk Dairesi, idare hukuku konusunda önemli bir karar verdi. Karara göre, kamu görevlisinin disiplin cezası usulüne uygun verilmelidir...',
    keywords: ['idare hukuku', 'kamu görevlisi', 'disiplin cezası'],
    category: 'İdare Hukuku',
    importance: 'Orta',
    views: 1400,
    downloads: 180
  },
  {
    id: 12,
    caseNumber: '2023/5319',
    decisionDate: '2023-11-25',
    chamber: '12. Hukuk Dairesi',
    subject: 'Fikri Mülkiyet Hukuku',
    summary: 'Telif hakkı ihlali durumunda tazminat talep edilebilir.',
    fullText: 'Yargıtay 12. Hukuk Dairesi, fikri mülkiyet hukuku konusunda önemli bir karar verdi. Karara göre, telif hakkı ihlali durumunda tazminat talep edilebilir...',
    keywords: ['fikri mülkiyet', 'telif hakkı', 'tazminat'],
    category: 'Fikri Mülkiyet Hukuku',
    importance: 'Orta',
    views: 2100,
    downloads: 320
  }
];