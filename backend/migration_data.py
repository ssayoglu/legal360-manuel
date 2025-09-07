# Migration data from frontend mock.js
LEGAL_PROCESSES_DATA = [
    {
        "id": "bosanma-sureci",
        "title": "Boşanma Süreci",
        "description": "Boşanma davası ve arabuluculuk süreçleri",
        "icon": "💔",
        "color": "#3B82F6",
        "gradient": "from-blue-400 to-blue-600",
        "duration": "6-12 ay",
        "difficulty": "Orta",
        "total_steps": 6,
        "has_calculator": False,
        "calculator_type": "",
        "category": "hukuk",
        "tags": ["boşanma", "aile hukuku", "arabuluculuk", "mahkeme"],
        "estimated_costs": {
            "title": "Boşanma Davası Tahmini Masrafları",
            "items": [
                {"name": "Avukat Ücreti", "min": 5000, "max": 25000, "note": "Anlaşmalı daha ucuz, çekişmeli daha pahalı"},
                {"name": "Dava Harcı", "min": 150, "max": 500, "note": "Davaya konu mal varlığına göre değişir"},
                {"name": "Arabuluculuk Ücreti", "min": 0, "max": 2000, "note": "Zorunlu değil, ama önerilir"},
                {"name": "Noter Masrafları", "min": 200, "max": 1000, "note": "Anlaşma protokolü için"},
                {"name": "Keşif/Bilirkişi", "min": 0, "max": 5000, "note": "Mal paylaşımı varsa gerekebilir"},
                {"name": "Temyiz Masrafları", "min": 0, "max": 3000, "note": "Karara itiraz edilirse"}
            ],
            "total_range": "5.350 - 36.500 TL",
            "free_options": [
                "Adli yardımdan yararlanabilirsiniz (gelir şartı var)",
                "Anlaşmalı boşanmada tek avukat yeterli",
                "Bazı barolar ücretsiz danışmanlık verir"
            ]
        },
        "steps": [
            {
                "id": "step1",
                "title": "Hukuki Danışmanlık",
                "short_title": "Danışmanlık",
                "description": "Bir avukatla görüşerek boşanma sürecinin detayları hakkında bilgi alın. Haklarınızı ve yükümlülüklerinizi öğrenin.",
                "duration": "1-2 saat",
                "participants": ["Avukat", "Danışan"],
                "required_documents": [
                    {"name": "Kimlik belgesi", "description": "Nüfus cüzdanı veya T.C. kimlik kartı"},
                    {"name": "Evlilik cüzdanı", "description": "Resmi nikah belgesi"},
                    {"name": "Gelir belgesi", "description": "Maaş bordrosu veya gelir beyannamesi"}
                ],
                "important_notes": [
                    "Boşanma sebeplerini belirleyin",
                    "Mal paylaşımı konularını değerlendirin",
                    "Çocuk velayeti durumunu görüşün"
                ],
                "position": {"x": 50, "y": 50},
                "connections": ["step2"],
                "status": "active"
            },
            {
                "id": "step2",
                "title": "Arabuluculuk",
                "short_title": "Arabuluculuk",
                "description": "Mahkeme öncesi arabuluculuk sürecini deneyin. Arabulucu, tarafsız bir üçüncü kişi olarak anlaşmanızı sağlamaya çalışır.",
                "duration": "2-4 hafta",
                "participants": ["Arabulucu", "Eşler", "Avukatlar"],
                "required_documents": [
                    {"name": "Arabuluculuk başvuru formu", "description": "Resmi başvuru belgesi"},
                    {"name": "Kimlik belgesi", "description": "Her iki eş için kimlik belgesi"},
                    {"name": "Evlilik cüzdanı", "description": "Orijinal evlilik belgesi"}
                ],
                "important_notes": [
                    "Zorunlu değil ancak önerilir",
                    "Daha hızlı ve ekonomik çözüm",
                    "Gizlilik esasına dayanır"
                ],
                "position": {"x": 250, "y": 50},
                "connections": ["step3", "step4"],
                "status": "upcoming"
            }
        ]
    },
    {
        "id": "is-davasi-sureci",
        "title": "İş Davası Süreci",
        "description": "İşçi hakları ve iş mahkemesi süreçleri",
        "icon": "💼",
        "color": "#F97316",
        "gradient": "from-orange-400 to-orange-600",
        "duration": "6-12 ay",
        "difficulty": "Orta",
        "total_steps": 5,
        "has_calculator": True,
        "calculator_type": "compensation",
        "category": "hukuk",
        "tags": ["işçi hakları", "tazminat", "iş kanunu", "mahkeme"],
        "estimated_costs": {
            "title": "İş Davası Tahmini Masrafları",
            "items": [
                {"name": "Avukat Ücreti", "min": 0, "max": 10000, "note": "İş mahkemelerinde vekalet ücreti muafiyeti var"},
                {"name": "Dava Harcı", "min": 0, "max": 0, "note": "İş davalarında harç muafiyeti"},
                {"name": "Arabuluculuk", "min": 0, "max": 0, "note": "Zorunlu ve ücretsiz"},
                {"name": "İcra Masrafları", "min": 50, "max": 500, "note": "İcra takibinde masraflar"},
                {"name": "Ekspertiz Ücreti", "min": 0, "max": 2000, "note": "Bilirkişi gerekirse"},
                {"name": "Temyiz Masrafları", "min": 0, "max": 1000, "note": "Yargıtay başvurusu"}
            ],
            "total_range": "50 - 13.500 TL",
            "free_options": [
                "İş davalarında harç muafiyeti var",
                "Arabuluculuk zorunlu ve ücretsiz",
                "Bazı avukatlar başarı ücreti alır",
                "Adli yardımdan yararlanabilirsiniz"
            ]
        },
        "steps": [
            {
                "id": "step1",
                "title": "İş Sona Erme",
                "short_title": "İşten Çıkış",
                "description": "İş sözleşmesinin sona ermesi ve alacakların hesaplanması",
                "duration": "1 hafta",
                "participants": ["İşçi", "İşveren", "İK Departmanı"],
                "required_documents": [
                    {"name": "İş sözleşmesi", "description": "Yazılı iş sözleşmesi belgesi"},
                    {"name": "Bordro örnekleri", "description": "Son 12 ayın maaş bordroları"},
                    {"name": "İşten çıkış belgesi", "description": "İşveren tarafından verilen resmi belge"}
                ],
                "important_notes": [
                    "Tüm belgelerinizi saklayın",
                    "Alacaklarınızı hesaplayın",
                    "Fesih gerekçesini öğrenin"
                ],
                "position": {"x": 50, "y": 50},
                "connections": ["step2"],
                "status": "active"
            }
        ]
    },
    {
        "id": "ceza-yargisi-sureci",
        "title": "Ceza Yargılaması Süreci",
        "description": "Ceza davası süreci ve haklarınız",
        "icon": "⚖️",
        "color": "#DC2626",
        "gradient": "from-red-400 to-red-600",
        "duration": "6-18 ay",
        "difficulty": "Zor",
        "total_steps": 7,
        "has_calculator": True,
        "calculator_type": "execution",
        "category": "ceza",
        "tags": ["ceza hukuku", "mahkeme", "savunma", "hak arama"],
        "estimated_costs": {
            "title": "Ceza Davası Tahmini Masrafları",
            "items": [
                {"name": "Avukat Ücreti", "min": 3000, "max": 50000, "note": "Suçun ağırlığına göre değişir"},
                {"name": "Dava Harcı", "min": 0, "max": 500, "note": "Davacı tarafından ödenir"},
                {"name": "Bilirkişi Ücreti", "min": 0, "max": 5000, "note": "Gerektiğinde"},
                {"name": "Temyiz Masrafları", "min": 0, "max": 2000, "note": "Yargıtay başvurusu"},
                {"name": "Tanık Masrafları", "min": 0, "max": 1000, "note": "Şehir dışından gelecekse"}
            ],
            "total_range": "3.000 - 58.500 TL",
            "free_options": [
                "Adli yardımdan yararlanabilirsiniz",
                "Baro avukatı tayin edilebilir",
                "Kamu davalarında harç yoktur"
            ]
        },
        "steps": [
            {
                "id": "step1",
                "title": "Suç İhbarı",
                "short_title": "İhbar",
                "description": "Suç ihbarı veya şikayetin yapılması",
                "duration": "1 gün",
                "participants": ["Mağdur", "Polis", "Savcılık"],
                "required_documents": [
                    {"name": "Kimlik belgesi", "description": "T.C. kimlik kartı veya nüfus cüzdanı"},
                    {"name": "Şikayet dilekçesi", "description": "Detaylı şikayet yazısı"},
                    {"name": "Delil belgeleri", "description": "Suçla ilgili tüm belgeler"}
                ],
                "important_notes": [
                    "Tüm delilleri saklayın",
                    "Detaylı şikayet yazın",
                    "Tanık bilgilerini verin"
                ],
                "position": {"x": 50, "y": 50},
                "connections": ["step2"],
                "status": "active"
            },
            {
                "id": "step2",
                "title": "Soruşturma",
                "short_title": "Soruşturma",
                "description": "Cumhuriyet Savcılığı tarafından soruşturma",
                "duration": "6 ay",
                "participants": ["Savcı", "Polis", "Şüpheli", "Mağdur"],
                "required_documents": [
                    {"name": "İfade tutanakları", "description": "Savcılıkta verilen ifadeler"},
                    {"name": "Delil toplama", "description": "Toplanan delil belgeleri"},
                    {"name": "Bilirkişi raporları", "description": "Teknik konularda bilirkişi raporları"}
                ],
                "important_notes": [
                    "Gizli soruşturmadır",
                    "Avukat hakkınız vardır",
                    "İfade verme zorunluluğu yok"
                ],
                "position": {"x": 250, "y": 50},
                "connections": ["step3", "step4"],
                "status": "upcoming"
            },
            {
                "id": "step3",
                "title": "İddianame",
                "short_title": "İddianame",
                "description": "Savcının iddianame düzenlemesi",
                "duration": "2-4 hafta",
                "participants": ["Savcı", "Mahkeme"],
                "required_documents": [
                    {"name": "İddianame", "description": "Savcının iddianame metni"},
                    {"name": "Soruşturma dosyası", "description": "Tüm soruşturma belgeleri"},
                    {"name": "Delil listesi", "description": "Sunulacak delillerin listesi"}
                ],
                "important_notes": [
                    "Suçlama kesinleşir",
                    "Mahkeme süreci başlar",
                    "Müdafi seçme hakkı"
                ],
                "position": {"x": 150, "y": 200},
                "connections": ["step5"],
                "status": "upcoming"
            },
            {
                "id": "step4",
                "title": "Kovuşturmama",
                "short_title": "Kovuşturmama",
                "description": "Yeterli delil yoksa kovuşturmama kararı",
                "duration": "2 hafta",
                "participants": ["Savcı", "Mağdur"],
                "required_documents": [
                    {"name": "Kovuşturmama kararı", "description": "Savcının kovuşturmama kararı"},
                    {"name": "İtiraz dilekçesi", "description": "Karara itiraz dilekçesi (varsa)"}
                ],
                "important_notes": [
                    "Karara itiraz edilebilir",
                    "Başka savcı inceler",
                    "Yeni delil sunulabilir"
                ],
                "position": {"x": 450, "y": 200},
                "connections": [],
                "status": "upcoming"
            },
            {
                "id": "step5",
                "title": "Mahkeme Süreci",
                "short_title": "Duruşma",
                "description": "Mahkemede aleni duruşma yapılması",
                "duration": "6-12 ay",
                "participants": ["Hakim", "Sanık", "Müşteki", "Avukatlar"],
                "required_documents": [
                    {"name": "Duruşma tutanakları", "description": "Tüm duruşma tutanakları"},
                    {"name": "Delil sunumu", "description": "Sunulan delil belgeleri"},
                    {"name": "Tanık ifadeleri", "description": "Tanık ifade tutanakları"}
                ],
                "important_notes": [
                    "Aleni duruşmadır",
                    "Susma hakkınız vardır",
                    "Müdafi bulundurabilirsiniz"
                ],
                "position": {"x": 150, "y": 350},
                "connections": ["step6", "step7"],
                "status": "upcoming"
            },
            {
                "id": "step6",
                "title": "Beraat Kararı",
                "short_title": "Beraat",
                "description": "Suçun sabit olmaması durumunda beraat",
                "duration": "2 hafta",
                "participants": ["Mahkeme", "Sanık"],
                "required_documents": [
                    {"name": "Beraat kararı", "description": "Mahkemenin beraat kararı"},
                    {"name": "Temyiz dilekçesi", "description": "Karara temyiz dilekçesi (varsa)"}
                ],
                "important_notes": [
                    "Sanık aklanmış olur",
                    "Savcı temyiz edebilir",
                    "Kişilik hakları korunur"
                ],
                "position": {"x": 50, "y": 500},
                "connections": [],
                "status": "upcoming"
            },
            {
                "id": "step7",
                "title": "Mahkumiyet",
                "short_title": "Mahkumiyet",
                "description": "Suçun sabit olması durumunda ceza verilmesi",
                "duration": "1 ay",
                "participants": ["Mahkeme", "Sanık", "İnfaz Kurumu"],
                "required_documents": [
                    {"name": "Mahkumiyet kararı", "description": "Mahkemenin mahkumiyet kararı"},
                    {"name": "Temyiz dilekçesi", "description": "Karara temyiz dilekçesi (varsa)"},
                    {"name": "İnfaz belgesi", "description": "Ceza infaz belgesi"}
                ],
                "important_notes": [
                    "Temyiz edilebilir",
                    "Ceza türü belirlenir",
                    "İnfaz süreci başlar"
                ],
                "position": {"x": 250, "y": 500},
                "connections": [],
                "status": "upcoming"
            }
        ]
    }
]

CALCULATOR_PARAMETERS_DATA = [
    # Compensation Calculator Parameters
    {
        "name": "Kıdem Tazminatı Çarpanı",
        "value": 30.0,
        "description": "Her hizmet yılı için brüt aylık ücret tutarı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    {
        "name": "İhbar Tazminatı Süresi",
        "value": 2.0,
        "description": "İhbar öneli süresi (ay)",
        "category": "compensation",
        "unit": "ay",
        "is_active": True
    },
    {
        "name": "Fazla Mesai Saatlik Ücret Çarpanı",
        "value": 1.5,
        "description": "Normal saatin üzerindeki mesai çarpanı",
        "category": "compensation",
        "unit": "kat",
        "is_active": True
    },
    {
        "name": "Yıllık İzin Ücreti",
        "value": 14.0,
        "description": "Kullanılmayan yıllık izin gün sayısı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    # Execution Calculator Parameters
    {
        "name": "İyi Hal İndirimi Oranı",
        "value": 33.0,
        "description": "İyi halli tutuklu için indirim oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Koşullu Salıverilme Oranı",
        "value": 50.0,
        "description": "Cezanın ne kadarı çekildikten sonra koşullu salıverilme",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Denetimli Serbestlik Oranı",
        "value": 75.0,
        "description": "Cezanın ne kadarı çekildikten sonra denetimli serbestlik",
        "category": "execution",
        "unit": "%",
        "is_active": True
    }
]

DOCUMENT_DESCRIPTIONS_DATA = [
    {"document_name": "Kimlik belgesi", "description": "Nüfus cüzdanı veya T.C. kimlik kartı"},
    {"document_name": "Evlilik cüzdanı", "description": "Resmi nikah belgesi"},
    {"document_name": "Gelir belgesi", "description": "Maaş bordrosu veya gelir beyannamesi"},
    {"document_name": "İş sözleşmesi", "description": "Yazılı iş sözleşmesi belgesi"},
    {"document_name": "Bordro örnekleri", "description": "Son 12 ayın maaş bordroları"},
    {"document_name": "İşten çıkış belgesi", "description": "İşveren tarafından verilen resmi belge"},
    {"document_name": "Arabuluculuk başvuru formu", "description": "Resmi başvuru belgesi"},
    {"document_name": "Dava dilekçesi", "description": "Mahkemeye sunulan resmi başvuru belgesi"},
    {"document_name": "Anlaşma protokolü", "description": "Taraflar arasındaki anlaşma belgesi"},
    {"document_name": "Mali durum belgeleri", "description": "Gelir ve gider durumunu gösteren belgeler"},
    {"document_name": "Delil belgeleri", "description": "Davayı destekleyici belgeler ve kanıtlar"},
    {"document_name": "Tanık listesi", "description": "Lehte tanıklık edecek kişilerin listesi"},
    {"document_name": "Bilirkişi raporları", "description": "Uzman kişiler tarafından hazırlanan raporlar"},
    {"document_name": "İnfaz belgesi", "description": "Cezanın infazı için gerekli resmi belgeler"}
]

BLOG_POSTS_DATA = [
    {
        "title": "Boşanma Sürecinde Bilinmesi Gerekenler",
        "slug": "bosanma-surecinde-bilinmesi-gerekenler",
        "excerpt": "Boşanma sürecinde karşılaşabileceğiniz durumlar ve hukuki haklarınız hakkında bilmeniz gerekenler.",
        "content": "Boşanma süreci, hem duygusal hem de hukuki açıdan zorlu bir süreçtir. Bu yazıda boşanma sürecinin aşamalarını, gerekli belgeleri ve haklarınızı detaylı olarak ele alacağız...",
        "author": "Av. Mehmet Yılmaz",
        "featured_image": None,
        "tags": ["boşanma", "aile hukuku", "hukuki rehber"],
        "category": "Aile Hukuku",
        "is_published": True,
        "meta_description": "Boşanma sürecinde bilmeniz gereken tüm detaylar ve hukuki haklarınız"
    },
    {
        "title": "İş Hukuku ve İşçi Haklarına Dair Bilinmesi Gerekenler",
        "slug": "is-hukuku-ve-isci-haklari",
        "excerpt": "İşyerinde karşılaştığınız sorunlar için hukuki çözüm yolları ve işçi haklarınız.",
        "content": "İş hayatında karşılaşabileceğiniz durumlar ve bu durumlarda hukuki haklarınızı nasıl koruyabileceğiniz konusunda rehber niteliğinde bilgiler...",
        "author": "Av. Ayşe Demir",
        "featured_image": None,
        "tags": ["iş hukuku", "işçi hakları", "tazminat"],
        "category": "İş Hukuku",
        "is_published": True,
        "meta_description": "İş hukuku ve işçi haklarına dair kapsamlı rehber"
    }
]

# Calculator Parameters Data
CALCULATOR_PARAMETERS_DATA = [
    # Compensation Calculator Parameters
    {
        "name": "Asgari Ücret (2024)",
        "value": 17002.0,
        "description": "2024 yılı için belirlenen asgari ücret tutarı",
        "category": "compensation",
        "unit": "TL",
        "is_active": True
    },
    {
        "name": "Kıdem Tazminatı Çarpanı",
        "value": 30.0,
        "description": "Kıdem tazminatı hesaplamasında kullanılan günlük ücret çarpanı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    {
        "name": "İhbar Tazminatı Çarpanı",
        "value": 15.0,
        "description": "İhbar tazminatı hesaplamasında kullanılan günlük ücret çarpanı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    {
        "name": "Fazla Mesai Çarpanı",
        "value": 1.5,
        "description": "Fazla mesai ücreti hesaplamasında kullanılan çarpan",
        "category": "compensation",
        "unit": "kat",
        "is_active": True
    },
    {
        "name": "Kıdem Tazminatı Tavanı",
        "value": 26061.86,
        "description": "Kıdem tazminatı hesaplamasında uygulanan maksimum günlük ücret tavanı",
        "category": "compensation",
        "unit": "TL",
        "is_active": True
    },
    {
        "name": "Yıllık İzin Ücreti Çarpanı",
        "value": 14.0,
        "description": "Yıllık izin ücreti hesaplamasında kullanılan günlük ücret çarpanı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    {
        "name": "Bayram İkramiyesi Çarpanı",
        "value": 7.0,
        "description": "Bayram ikramiyesi hesaplamasında kullanılan günlük ücret çarpanı",
        "category": "compensation",
        "unit": "gün",
        "is_active": True
    },
    
    # Execution Calculator Parameters
    {
        "name": "İyi Hal İndirimi",
        "value": 0.33,
        "description": "İyi hal durumunda uygulanan ceza indirimi oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Açık Cezaevi Şartı",
        "value": 0.5,
        "description": "Açık cezaevi şartı ile infaz edilebilecek ceza oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Ev Hapsi Şartı",
        "value": 0.25,
        "description": "Ev hapsi şartı ile infaz edilebilecek ceza oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Elektronik Kelepçe Şartı",
        "value": 0.33,
        "description": "Elektronik kelepçe şartı ile infaz edilebilecek ceza oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Denetimli Serbestlik Şartı",
        "value": 0.4,
        "description": "Denetimli serbestlik şartı ile infaz edilebilecek ceza oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    },
    {
        "name": "Hapis Cezası İndirimi",
        "value": 0.2,
        "description": "Genel hapis cezası indirimi oranı",
        "category": "execution",
        "unit": "%",
        "is_active": True
    }
]

# Legal Aid Information Data
LEGAL_AID_DATA = {
    "title": "Ücretsiz Adli Yardım Hizmetleri",
    "description": "Maddi durumu yetersiz olan vatandaşlarımızın hukuki sorunlarında ücretsiz destek alabileceği resmi hizmetler.",
    "sections": [
        {
            "icon": "Scale",
            "title": "Adli Yardım Nedir?",
            "content": "Maddi durumu yetersiz olan vatandaşların hukuki sorunlarında ücretsiz avukat desteği almasını sağlayan resmi hizmet. Barolar ve Adalet Bakanlığı tarafından yürütülür.",
            "color": "bg-blue-100"
        },
        {
            "icon": "Users",
            "title": "Kimler Yararlanabilir?",
            "content": "Gelir durumu belirli sınırların altında olan, maddi durumu yetersiz olan tüm vatandaşlar. Vatandaşlık şartı aranmaz, ikamet yeterlidir.",
            "color": "bg-green-100"
        },
        {
            "icon": "FileText",
            "title": "Hangi Konularda Destek?",
            "content": "Aile hukuku, iş hukuku, ceza hukuku, icra hukuku ve diğer tüm hukuki konularda ücretsiz danışmanlık ve dava takibi hizmeti.",
            "color": "bg-purple-100"
        },
        {
            "icon": "MessageCircle",
            "title": "Nasıl Başvuru Yapılır?",
            "content": "En yakın baroya giderek başvuru formu doldurulur. Gelir belgesi ve kimlik belgesi ile birlikte başvuru yapılabilir.",
            "color": "bg-orange-100"
        }
    ],
    "helplines": [
        {
            "name": "Adli Yardım Hattı",
            "phone": "175",
            "hours": "7/24",
            "description": "Acil durumlar için ücretsiz danışmanlık"
        },
        {
            "name": "Baro Adli Yardım",
            "phone": "444 0 175",
            "hours": "09:00-17:00",
            "description": "Detaylı bilgi ve yönlendirme"
        }
    ],
    "baro_contacts": [
        {
            "city": "İstanbul",
            "name": "İstanbul Barosu",
            "phone": "0212 251 23 00",
            "address": "Beyoğlu, İstanbul",
            "website": "istanbulbarosu.org.tr"
        },
        {
            "city": "Ankara",
            "name": "Ankara Barosu",
            "phone": "0312 417 77 00",
            "address": "Çankaya, Ankara",
            "website": "ankarabarosu.org.tr"
        },
        {
            "city": "İzmir",
            "name": "İzmir Barosu",
            "phone": "0232 441 12 00",
            "address": "Konak, İzmir",
            "website": "izmirbarosu.org.tr"
        }
    ],
    "eligibility_criteria": "Gelir durumu belirli sınırların altında olan, maddi durumu yetersiz olan tüm vatandaşlar.",
    "application_process": "1. En yakın baroya giderek başvuru formu doldurun\n2. Gelir belgesi ve kimlik belgesi ile birlikte başvuru yapın\n3. Baro tarafından değerlendirilir\n4. Uygun görülürse avukat atanır",
    "required_documents": [
        "Kimlik belgesi (nüfus cüzdanı veya T.C. kimlik kartı)",
        "Gelir belgesi (maaş bordrosu veya gelir beyannamesi)",
        "İkamet belgesi",
        "Başvuru formu",
        "Varsa dava dosyası"
    ],
    "contact_info": {
        "phone": "175",
        "email": "adliyardim@adalet.gov.tr",
        "address": "Adalet Bakanlığı, Ankara",
        "working_hours": "09:00-17:00 (Pazartesi-Cuma)"
    },
    "is_active": True
}