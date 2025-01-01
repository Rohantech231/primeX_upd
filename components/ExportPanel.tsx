'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToJSON, exportToPDF } from '@/lib/export';
import type { EmotionData } from '@/lib/emotion-detection';

interface ExportPanelProps {
  currentEmotions: EmotionData | null;
}

export function ExportPanel({ currentEmotions }: ExportPanelProps) {
  const handleExportJSON = () => {
    if (currentEmotions) {
      exportToJSON([currentEmotions]);
    }
  };

  const handleExportPDF = () => {
    if (currentEmotions) {
      exportToPDF([currentEmotions]);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleExportJSON}
          disabled={!currentEmotions}
        >
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={!currentEmotions}
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </Card>
  );
}