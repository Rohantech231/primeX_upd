import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export type EmotionDataPoint = {
  timestamp: number;
  happiness: number;
  sadness: number;
  anger: number;
};

export function exportToJSON(data: EmotionDataPoint[]) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  saveAs(blob, `emotion-data-${new Date().toISOString()}.json`);
}

export function exportToPDF(data: EmotionDataPoint[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Emotion Analysis Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text('Generated: ' + new Date().toLocaleString(), 20, 30);
  
  let y = 50;
  data.forEach((point, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const time = new Date(point.timestamp).toLocaleTimeString();
    doc.text(`Time: ${time}`, 20, y);
    doc.text(`Happiness: ${(point.happiness * 100).toFixed(1)}%`, 20, y + 7);
    doc.text(`Sadness: ${(point.sadness * 100).toFixed(1)}%`, 20, y + 14);
    doc.text(`Anger: ${(point.anger * 100).toFixed(1)}%`, 20, y + 21);
    
    y += 35;
  });
  
  doc.save(`emotion-report-${new Date().toISOString()}.pdf`);
}