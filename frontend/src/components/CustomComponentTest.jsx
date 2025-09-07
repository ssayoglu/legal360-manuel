import React from 'react';

// Test custom component imports
import Header from './Header';
import CostBreakdown from './CostBreakdown';
import AdBanner from './AdBanner';

const CustomComponentTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Component Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Custom Component Types:</h2>
          <p>Header: {typeof Header}</p>
          <p>CostBreakdown: {typeof CostBreakdown}</p>
          <p>AdBanner: {typeof AdBanner}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Header Test:</h2>
          <Header />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">AdBanner Test:</h2>
          <AdBanner type="horizontal" />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">CostBreakdown Test:</h2>
          <CostBreakdown 
            process={{ 
              title: 'Test Process', 
              gradient: 'from-red-500 to-red-600', 
              estimatedCosts: { 
                title: 'Test Costs', 
                items: [{name: 'Item 1', min: 10, max: 20}], 
                total_range: '10-20 TL', 
                free_options: [] 
              } 
            }} 
            onClose={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};

export default CustomComponentTest;
