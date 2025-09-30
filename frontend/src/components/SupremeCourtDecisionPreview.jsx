import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Gavel } from 'lucide-react';

const CATEGORY_LABELS = {
  civil: 'Medeni Hukuk',
  criminal: 'Ceza Hukuku',
  family: 'Aile Hukuku',
  labor: 'İş Hukuku',
  commercial: 'Ticaret Hukuku',
};

const SupremeCourtDecisionPreview = ({ decision, onClick }) => {
  if (!decision) return null;
  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{CATEGORY_LABELS[decision.category] || decision.category}</Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {decision.date ? new Date(decision.date).toLocaleDateString('tr-TR') : ''}
          </div>
        </div>
        <CardTitle className="text-base group-hover:text-red-600 transition-colors leading-snug">
          {decision.title}
        </CardTitle>
        <div className="text-xs text-gray-600 mt-1 flex items-center flex-wrap gap-x-3">
          <span className="flex items-center">
            <Gavel className="h-3 w-3 mr-1" />
            <span className="font-medium">{decision.court}</span>
          </span>
          {decision.decision_number && (
            <span className="text-gray-500">Dosya No: {decision.decision_number}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-3">{decision.summary}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {decision.keywords?.slice(0, 5).map((k, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">
              {k}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupremeCourtDecisionPreview;


