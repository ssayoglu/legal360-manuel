import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Scale, Users, Target, Heart, Lightbulb, Award } from 'lucide-react';
import Header from './Header';
import AdBanner from './AdBanner';

const AboutPage = () => {
  const values = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Erişilebilirlik",
      description: "Hukuki bilgileri herkesin anlayabileceği şekilde sunuyoruz"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "İnovasyon",
      description: "Teknoloji ile hukuku buluşturarak yeni çözümler üretiyoruz"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Empati",
      description: "Vatandaşların ihtiyaçlarını anlayarak çözüm odaklı yaklaşıyoruz"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Kalite",
      description: "Güncel ve doğru hukuki bilgileri titizlikle hazırlıyoruz"
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & Hukuk Uzmanı",
      description: "15 yıllık hukuk deneyimi ile projeyi yönetiyor"
    },
    {
      name: "Zeynep Kaya",
      role: "UX/UI Tasarımcı",
      description: "Kullanıcı deneyimi odaklı tasarımlar geliştiriyor"
    },
    {
      name: "Mehmet Demir",
      role: "Yazılım Geliştirici",
      description: "Platform altyapısını ve teknik çözümleri sağlıyor"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
              <Scale className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Hakkımızda
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Legal Design Turkey olarak, karmaşık hukuki süreçleri vatandaşların kolayca 
            anlayabileceği görsel formatlara dönüştürüyoruz. Amacımız, hukuki bilgilere 
            erişimi demokratikleştirmek ve adalete ulaşımı kolaylaştırmaktır.
          </p>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-xl text-blue-600">Misyonumuz</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                  Hukuki süreçleri görselleştirerek, vatandaşların hukuki haklarını öğrenmesini ve 
                  adalete erişimini kolaylaştırmak. Karmaşık yasal prosedürleri herkesin anlayabileceği 
                  şekilde sunarak, hukuki okuryazarlığı artırmak.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-xl text-green-600">Vizyonumuz</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                  Türkiye'de hukuki bilgilere erişimde öncü platform olmak. Her vatandaşın hukuki 
                  haklarını bildiği, süreçleri anlayabildiği ve adalete eşit mesafede erişebildiği 
                  bir toplum yaratmaya katkıda bulunmak.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg text-gray-600">
              Çalışmalarımızı yönlendiren temel değerler
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full text-blue-600 w-fit">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="square" />
        </div>
      </div>

      {/* Team */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-gray-600">
              Legal Design Turkey'yi hayata geçiren uzman ekip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-sm">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">8+</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Hukuki Süreç</div>
              <div className="text-sm text-gray-600">Detaylı olarak işlenmiş</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Kullanıcı</div>
              <div className="text-sm text-gray-600">Platformdan yararlandı</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Memnuniyet</div>
              <div className="text-sm text-gray-600">Kullanıcı geri bildirimi</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;