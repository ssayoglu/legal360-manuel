import React from 'react';

// Test Card component imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const CardTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Card Component Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Card Component Types:</h2>
          <p>Card: {typeof Card}</p>
          <p>CardHeader: {typeof CardHeader}</p>
          <p>CardTitle: {typeof CardTitle}</p>
          <p>CardDescription: {typeof CardDescription}</p>
          <p>CardContent: {typeof CardContent}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Card Test:</h2>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
              <CardDescription>This is a test card description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardTest;
