// Speech recognition service
export class SpeechRecognitionService {
  static isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  static create() {
    if (!this.isSupported()) {
      throw new Error('Speech recognition is not supported in this browser');
    }
    return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  }
}