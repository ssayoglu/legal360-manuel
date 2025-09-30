import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Header from './Header';
import { usePageTitle } from '../hooks/usePageTitle';
import AdBanner from './AdBanner';
import { apiService } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [contactContent, setContactContent] = useState({
    hero_title: 'İletişim',
    hero_description: 'Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.',
    contact_email: 'info@legaldesignturkey.com',
    contact_phone: '0212 XXX XX XX',
    contact_address: 'İstanbul, Türkiye',
    office_hours: 'Pazartesi - Cuma, 09:00 - 18:00',
    contact_form_title: 'Bize Mesaj Gönderin',
    contact_form_description: 'Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.',
    faq_title: 'Sık Sorulan Sorular',
    faq_description: 'En çok merak edilen sorular ve cevapları',
    faq_items: [
      {
        question: 'Platform tamamen ücretsiz mi?',
        answer: 'Evet, Legal Design Turkey platformundaki tüm içerikler tamamen ücretsizdir. Amacımız hukuki bilgilere herkesin eşit erişimini sağlamaktır.'
      },
      {
        question: 'Verdiğiniz bilgiler hukuki tavsiye niteliğinde mi?',
        answer: 'Hayır, platformumuz sadece bilgilendirme amaçlıdır. Kesin hukuki tavsiye için mutlaka bir avukatla görüşmelisiniz.'
      },
      {
        question: 'Yeni süreçler ekleniyor mu?',
        answer: 'Evet, sürekli olarak yeni hukuki süreçler ekliyoruz. Blog sayfamızdan güncellemeleri takip edebilirsiniz.'
      },
      {
        question: 'Mobil uygulamanız var mı?',
        answer: 'Şu anda web sitesi tamamen mobile uyumlu. Yakın gelecekte mobil uygulama geliştirmeyi planlıyoruz.'
      }
    ]
  });

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const content = await apiService.getContactPageContent();
      setContactContent(content);
    } catch (error) {
      console.error('Error fetching contact content:', error);
      // Keep default content if fetch fails
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formData);
  };

  // Dynamic contact info based on API data
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-posta",
      info: contactContent.contact_email,
      description: "Sorularınız için bize yazın",
      action: `mailto:${contactContent.contact_email}`
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefon",
      info: contactContent.contact_phone,
      description: "Çalışma saatleri içinde arayın",
      action: `tel:${contactContent.contact_phone.replace(/\s/g, '')}`
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Adres",
      info: contactContent.contact_address,
      description: "Merkez ofisimiz",
      action: null
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Çalışma Saatleri",
      info: contactContent.office_hours.split(',')[0] || contactContent.office_hours,
      description: contactContent.office_hours.split(',')[1]?.trim() || "",
      action: null
    }
  ];

  usePageTitle(`${contactContent.hero_title} – Legal Design Turkey`, contactContent.hero_description);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {contactContent.hero_title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {contactContent.hero_description}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => item.action && window.open(item.action)}>
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full text-blue-600 w-fit">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900 mb-1">{item.info}</p>
                  <CardDescription className="text-gray-600 text-sm">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Contact Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {contactContent.contact_form_title}
            </h2>
            <p className="text-gray-600">
              {contactContent.contact_form_description}
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Konu seçin...</option>
                    <option value="genel">Genel Soru</option>
                    <option value="oneri">Öneri</option>
                    <option value="hata">Hata Bildirimi</option>
                    <option value="isbirligi">İşbirliği</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Mesaj Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {contactContent.faq_title}
            </h2>
            <p className="text-gray-600">
              {contactContent.faq_description}
            </p>
          </div>

          <div className="space-y-4">
            {contactContent.faq_items && contactContent.faq_items.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="square" />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;