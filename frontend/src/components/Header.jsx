import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Scale, Menu, X } from 'lucide-react';
import { apiService } from '../services/api';

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [menuConfig, setMenuConfig] = useState(null);

  useEffect(() => {
    fetchSiteSettings();
    fetchMenuConfig();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const settings = await apiService.getSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Set fallback settings
      setSiteSettings({
        site_title: 'Legal Design Turkey',
        site_description: 'Hukuki Süreçleri Görselleştiriyoruz',
        logo_url: null
      });
    }
  };

  const fetchMenuConfig = async () => {
    try {
      const config = await apiService.getMenuConfig();
      setMenuConfig(config);
    } catch (error) {
      console.error('Error fetching menu config:', error);
      // Set fallback menu config
      setMenuConfig({
        menu_items: [
          { label: 'Ana Sayfa', url: '/', order: 1, is_active: true },
          { label: 'Süreçler', url: '/hukuki-surecler', order: 2, is_active: true },
          { label: 'Blog', url: '/blog', order: 3, is_active: true },
          { label: 'Yargıtay Kararları', url: '/yargitay-kararlari', order: 4, is_active: true },
          { label: 'Hakkımızda', url: '/hakkimizda', order: 5, is_active: true },
          { label: 'İletişim', url: '/iletisim', order: 6, is_active: true }
        ],
        header_buttons: [
          { label: 'Adli Yardım', url: '/adli-yardim', type: 'secondary', is_active: true },
          { label: 'Beta', url: '#', type: 'primary', is_active: true }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Get active menu items, sorted by order
  const activeMenuItems = menuConfig?.menu_items
    .filter(item => item.is_active)
    .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  // Get active header buttons
  const activeHeaderButtons = menuConfig?.header_buttons
    .filter(button => button.is_active) || [];

  const isCurrentPage = (href) => location.pathname === href;

  // Show loading state to prevent flash
  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-200 rounded-xl animate-pulse">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
                <div className="hidden sm:block">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              {siteSettings?.logo_url ? (
                <img 
                  src={siteSettings.logo_url} 
                  alt={siteSettings.site_title}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Scale className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">{siteSettings?.site_title}</h1>
                <p className="text-xs text-gray-600">{siteSettings?.site_description}</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {activeMenuItems.map((item) => {
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.url)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPage(item.url)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            {activeHeaderButtons.map((button, index) => (
              <React.Fragment key={button.label}>
                {button.type === 'secondary' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(button.url)}
                    className="hidden sm:flex text-green-600 border-green-300 hover:bg-green-50"
                  >
                    {button.label}
                  </Button>
                ) : (
                  <Badge variant="secondary" className="hidden sm:flex bg-blue-100 text-blue-700">
                    {button.label}
                  </Badge>
                )}
              </React.Fragment>
            ))}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {activeMenuItems.map((item) => {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.url);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPage(item.url)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="border-t pt-2 mt-2">
              {activeHeaderButtons
                .filter(button => button.type === 'secondary')
                .map((button) => (
                  <button
                    key={button.label}
                    onClick={() => {
                      navigate(button.url);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 rounded-md text-sm font-medium text-green-600 hover:bg-green-50"
                  >
                    <span>{button.label}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;