import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import AdBanner from './AdBanner';
import { apiService } from '../services/api';

const Footer = () => {
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState({
    site_title: 'Legal Design Turkey',
    site_description: 'Hukuki süreçleri görselleştiriyoruz',
    logo_url: null
  });
  const [footerConfig, setFooterConfig] = useState({
    footer_sections: [
      {
        title: 'Hukuki Süreçler',
        links: [
          { label: 'Boşanma Süreci', url: '/hukuki-surec/bosanma-sureci' },
          { label: 'İş Davası', url: '/hukuki-surec/is-davasi-sureci' },
          { label: 'Ceza Yargılaması', url: '/hukuki-surec/ceza-yargisi-sureci' }
        ]
      },
      {
        title: 'Bilgi',
        links: [
          { label: 'Hakkımızda', url: '/hakkimizda' },
          { label: 'İletişim', url: '/iletisim' },
          { label: 'Blog', url: '/blog' }
        ]
      }
    ],
    copyright_text: '© 2025 Legal Design Turkey. Tüm hakları saklıdır.'
  });

  useEffect(() => {
    fetchSiteSettings();
    fetchFooterConfig();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const settings = await apiService.getSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Keep default settings if fetch fails
    }
  };

  const fetchFooterConfig = async () => {
    try {
      const config = await apiService.getFooterConfig();
      setFooterConfig(config);
    } catch (error) {
      console.error('Error fetching footer config:', error);
      // Keep default footer config if fetch fails
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {siteSettings.logo_url ? (
              <img 
                src={siteSettings.logo_url} 
                alt={siteSettings.site_title}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
            )}
            <span className="text-xl font-bold">{siteSettings.site_title}</span>
          </div>
          <p className="text-gray-400 mb-4 leading-relaxed max-w-2xl mx-auto">
            {siteSettings.site_description}
          </p>
          
          {/* Dynamic Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            {footerConfig.footer_sections.map((section, sectionIndex) => (
              <React.Fragment key={section.title}>
                {section.links.map((link, linkIndex) => (
                  <React.Fragment key={link.label}>
                    <button 
                      onClick={() => navigate(link.url)}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                    {/* Add separator if not the last link in the last section */}
                    {!(sectionIndex === footerConfig.footer_sections.length - 1 && 
                       linkIndex === section.links.length - 1) && <span>•</span>}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            {footerConfig.copyright_text}
          </p>
        </div>
      </div>
      <div className="mt-6 sm:hidden">
        <AdBanner type="mobile" />
      </div>
    </footer>
  );
};

export default Footer;


