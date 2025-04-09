import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import type { EmotionData } from './emotion-detection';

type EmotionSummary = {
  average: number;
  max: number;
  timeOfMax: string;
  frequency: number;
};

function calculateEmotionSummary(data: EmotionData[], emotion: keyof EmotionData): EmotionSummary {
  const values = data.map(point => point[emotion]).filter((value): value is number => typeof value === 'number');
  const max = Math.max(...values);
  const maxIndex = values.indexOf(max);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const frequency = values.filter(val => val > 0.3).length / values.length; // How often emotion was significant

  return {
    average,
    max,
    timeOfMax: new Date(data[maxIndex].timestamp).toLocaleTimeString(),
    frequency
  };
}

function getEmotionalStateDescription(data: EmotionData[]): string {
  const emotions = ['happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust', 'neutral'] as const;
  const summaries = emotions.map(emotion => ({
    emotion,
    summary: calculateEmotionSummary(data, emotion)
  }));

  // Find dominant emotion
  const dominantEmotion = summaries.reduce((max, current) => 
    current.summary.frequency > max.summary.frequency ? current : max
  );

  // Find secondary emotion
  const secondaryEmotion = summaries
    .filter(s => s.emotion !== dominantEmotion.emotion)
    .reduce((max, current) => 
      current.summary.frequency > max.summary.frequency ? current : max
    );

  return `During this session, the predominant emotional state was ${dominantEmotion.emotion} ` +
    `(present in ${(dominantEmotion.summary.frequency * 100).toFixed(0)}% of observations), ` +
    `with ${secondaryEmotion.emotion} as a secondary emotion ` +
    `(${(secondaryEmotion.summary.frequency * 100).toFixed(0)}% presence). ` +
    `The highest intensity of ${dominantEmotion.emotion} (${(dominantEmotion.summary.max * 100).toFixed(1)}%) ` +
    `was observed at ${dominantEmotion.summary.timeOfMax}.`;
}

export function exportToJSON(data: EmotionData[]) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  saveAs(blob, `emotion-data-${new Date().toISOString()}.json`);
}

export function exportToPDF(data: EmotionData[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204);
  doc.text('Emotion Analysis Report', pageWidth / 2, 20, { align: 'center' });
  
  // Timestamp
  doc.setFontSize(12);
  doc.setTextColor(102, 102, 102);
  doc.text('Generated: ' + new Date().toLocaleString(), 20, 30);
  
  // Summary section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Analysis', 20, 45);
  
  doc.setFontSize(12);
  const summaryText = getEmotionalStateDescription(data);
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 40);
  doc.text(splitSummary, 20, 55);

  // Detailed Statistics
  let y = 85;
  doc.setFontSize(16);
  doc.text('Detailed Statistics', 20, y);
  y += 10;

  doc.setFontSize(12);
  const emotions = ['happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust', 'neutral'] as const;
  
  emotions.forEach(emotion => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const summary = calculateEmotionSummary(data, emotion);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", 'bold');
    doc.text(emotion.charAt(0).toUpperCase() + emotion.slice(1), 20, y);
    doc.setFont("helvetica", 'normal');
    
    y += 7;
    doc.setTextColor(51, 51, 51);
    doc.text(`Average Intensity: ${(summary.average * 100).toFixed(1)}%`, 30, y);
    y += 7;
    doc.text(`Peak Intensity: ${(summary.max * 100).toFixed(1)}% at ${summary.timeOfMax}`, 30, y);
    y += 7;
    doc.text(`Frequency: ${(summary.frequency * 100).toFixed(0)}% of session`, 30, y);
    y += 12;
  });

  // Timeline
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Emotion Timeline', 20, 20);
  
  y = 35;
  doc.setFontSize(10);
  
  data.forEach((point, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const time = new Date(point.timestamp).toLocaleTimeString();
    const dominantEmotion = Object.entries(point)
      .filter(([key]) => key !== 'timestamp')
      .reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: -1 });

    doc.setTextColor(0, 0, 0);
    doc.text(`${time} - Dominant: ${dominantEmotion.key} (${(dominantEmotion.value * 100).toFixed(1)}%)`, 20, y);
    
    y += 5;
    doc.setTextColor(102, 102, 102);
    const emotions = Object.entries(point)
      .filter(([key]) => key !== 'timestamp')
      .map(([key, value]) => `${key}: ${(value * 100).toFixed(1)}%`)
      .join(', ');
    
    const splitEmotions = doc.splitTextToSize(emotions, pageWidth - 40);
    doc.text(splitEmotions, 30, y);
    
    y += splitEmotions.length * 5 + 5;
  });
  
  doc.save(`emotion-report-${new Date().toISOString()}.pdf`);
}