import React from 'react';

// Test individual UI component imports
import { Button } from './ui/button';

const UIComponentTest2 = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">UI Component Test 2 - Button Only</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Button Type:</h2>
          <p>Button: {typeof Button}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Button Test:</h2>
          <Button>Test Button</Button>
        </div>
      </div>
    </div>
  );
};

export default UIComponentTest2;
