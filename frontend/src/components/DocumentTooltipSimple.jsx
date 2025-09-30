import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const DocumentTooltipSimple = ({ document, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const documentDescriptions = {
    'Kimlik belgesi': 'T.C. kimlik kartı veya nüfus cüzdanının aslı ve fotokopisi',
    'Evlilik cüzdanı': 'Nüfus müdürlüğünden alınan güncel evlilik cüzdanı',
    'Gelir belgesi': 'Maaş bordrosu, SGK hizmet dökümü veya gelir beyannamesi',
    'Arabuluculuk başvuru formu': 'Arabuluculuk merkezinden temin edilecek standart başvuru formu',
    'Dava dilekçesi': 'Avukat tarafından hazırlanacak mahkemeye sunulacak dilekçe'
  };
  
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

export default DocumentTooltipSimple;