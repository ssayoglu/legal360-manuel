import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Target, Zap } from 'lucide-react';
import { apiService } from '../services/api';

const AdBanner = ({ type = 'horizontal', className = '' }) => {
  const bannerConfigs = {
    horizontal: {
      dimensions: 'h-24 w-full',
      content: {
        title: 'Reklam Alanı',
        subtitle: '728x90 Banner',
        description: 'Bu alan reklam içeriği için ayrılmıştır'
      },
      gradient: 'from-blue-50 to-indigo-100',
      icon: Target
    },
    square: {
      dimensions: 'h-64 w-full md:w-64 mx-auto',
      content: {
        title: 'Reklam Alanı',
        subtitle: '300x250 Banner',
        description: 'Bu alan reklam içeriği için ayrılmıştır'
      },
      gradient: 'from-green-50 to-emerald-100',
      icon: Zap
    },
    sidebar: {
      dimensions: 'h-96 w-full',
      content: {
        title: 'Reklam Alanı',
        subtitle: '160x600 Skyscraper',
        description: 'Bu alan reklam içeriği için ayrılmıştır'
      },
      gradient: 'from-purple-50 to-pink-100',
      icon: ExternalLink
    },
    mobile: {
      dimensions: 'h-16 w-full',
      content: {
        title: 'Mobil Reklam',
        subtitle: '320x50 Banner',
        description: 'Mobil reklam alanı'
      },
      gradient: 'from-orange-50 to-red-100',
      icon: Target
    },
    infeed: {
      dimensions: 'h-full w-full min-h-[260px] md:min-h-[280px] lg:min-h-[300px]',
      content: {
        title: 'Reklam Alanı',
        subtitle: 'Blog Liste İçi',
        description: 'Bu alan reklam içeriği için ayrılmıştır'
      },
      gradient: 'from-yellow-50 to-amber-100',
      icon: ExternalLink
    }
  };

  const config = bannerConfigs[type] || bannerConfigs.horizontal;
  const IconComponent = config.icon;

  const [adSettings, setAdSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await apiService.getAdSettings();
        if (mounted) setAdSettings(s);
      } catch (e) {
        // fallback to placeholder silently
      }
    })();
    return () => { mounted = false; };
  }, []);

  const selectCodeByType = (settings) => {
    if (!settings || settings.is_active === false) return '';
    switch (type) {
      case 'horizontal':
        return settings.horizontal_code || '';
      case 'square':
        return settings.square_code || '';
      case 'sidebar':
        return settings.sidebar_code || '';
      case 'mobile':
        return settings.mobile_code || '';
      case 'infeed':
        return settings.infeed_code || '';
      default:
        return '';
    }
  };

  const code = selectCodeByType(adSettings);

  if (code) {
    return (
      <div className={`${className}`}>
        <div className={`${config.dimensions} flex items-center justify-center`}
             dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className={`${config.dimensions} bg-gradient-to-r ${config.gradient} border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-300`}>
        <div className="h-full flex items-center justify-center p-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <IconComponent className="h-5 w-5 text-gray-500 mr-2" />
              <Badge variant="outline" className="text-xs bg-white/50">
                {config.content.subtitle}
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              {config.content.title}
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              {config.content.description}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdBanner;