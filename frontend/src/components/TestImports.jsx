import React from 'react';

// Test individual imports
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Home, 
  Briefcase, 
  Scale, 
  Clock, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Calculator, 
  DollarSign 
} from 'lucide-react';
import Header from './Header';
import CostBreakdown from './CostBreakdown';
import AdBanner from './AdBanner';

const TestImports = () => {
  return (
    <div className="p-4">
      <h1>Import Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2>UI Components</h2>
          <Button>Test Button</Button>
          <Card>
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Test content</p>
            </CardContent>
          </Card>
          <Badge>Test Badge</Badge>
        </div>
        
        <div>
          <h2>Icons</h2>
          <ArrowLeft className="w-6 h-6" />
          <Heart className="w-6 h-6" />
          <Home className="w-6 h-6" />
          <Briefcase className="w-6 h-6" />
          <Scale className="w-6 h-6" />
        </div>
        
        <div>
          <h2>Custom Components</h2>
          <Header />
          <CostBreakdown process={{estimatedCosts: {title: 'Test', items: []}}} onClose={() => {}} />
          <AdBanner />
        </div>
      </div>
    </div>
  );
};

export default TestImports;
