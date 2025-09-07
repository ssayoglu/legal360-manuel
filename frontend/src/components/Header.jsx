import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Scale, Menu, X, Search } from 'lucide-react';

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Süreçler', href: '/processes' },
    { name: 'Blog', href: '/blog' },
    { name: 'Yargıtay Kararları', href: '/yargitay' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const isCurrentPage = (href) => location.pathname === href;

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
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Legal Design Turkey</h1>
                <p className="text-xs text-gray-600">Hukuki Süreçleri Görselleştiriyoruz</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPage(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Bar - Desktop */}
          {(location.pathname === '/' || location.pathname === '/processes') && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Hukuki süreç ara..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </form>
            </div>
          )}

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/legal-aid')}
              className="hidden sm:flex text-green-600 border-green-300 hover:bg-green-50"
            >
              Adli Yardım
            </Button>
            <Badge variant="secondary" className="hidden sm:flex bg-blue-100 text-blue-700">
              Beta
            </Badge>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {(location.pathname === '/' || location.pathname === '/processes') && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Hukuki süreç ara..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPage(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              );
            })}
            <div className="border-t pt-2 mt-2">
              <button
                onClick={() => {
                  navigate('/legal-aid');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 rounded-md text-sm font-medium text-green-600 hover:bg-green-50"
              >
                <span>Adli Yardım</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;