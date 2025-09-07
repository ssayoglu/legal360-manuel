import React from 'react';
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

const IconTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Icon Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Icon Types:</h2>
          <p>ArrowLeft: {typeof ArrowLeft}</p>
          <p>Heart: {typeof Heart}</p>
          <p>Home: {typeof Home}</p>
          <p>Briefcase: {typeof Briefcase}</p>
          <p>Scale: {typeof Scale}</p>
          <p>Clock: {typeof Clock}</p>
          <p>Users: {typeof Users}</p>
          <p>FileText: {typeof FileText}</p>
          <p>AlertCircle: {typeof AlertCircle}</p>
          <p>CheckCircle2: {typeof CheckCircle2}</p>
          <p>ChevronRight: {typeof ChevronRight}</p>
          <p>ChevronLeft: {typeof ChevronLeft}</p>
          <p>Calculator: {typeof Calculator}</p>
          <p>DollarSign: {typeof DollarSign}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Icon Rendering Test:</h2>
          <div className="flex gap-4">
            <ArrowLeft className="h-6 w-6 text-red-500" />
            <Heart className="h-6 w-6 text-red-500" />
            <Home className="h-6 w-6 text-blue-500" />
            <Briefcase className="h-6 w-6 text-green-500" />
            <Scale className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconTest;
