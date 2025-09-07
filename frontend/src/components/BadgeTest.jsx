import React from 'react';

// Test Badge component import
import { Badge } from './ui/badge';

const BadgeTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Badge Component Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Badge Component Type:</h2>
          <p>Badge: {typeof Badge}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Badge Test:</h2>
          <div className="flex gap-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeTest;
