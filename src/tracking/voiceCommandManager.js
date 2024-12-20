import { showSuccess, showError } from '../utils/notificationUtils.js';

export class VoiceCommandManager {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.isListening = false;
    this.setupRecognition();
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      showSuccess('Voice recognition active');
    };

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      
      switch (command) {
        case 'left click':
          this.simulateMouseEvent('click');
          showSuccess('Left click');
          break;
        case 'right click':
          this.simulateMouseEvent('contextmenu');
          showSuccess('Right click');
          break;
        case 'scroll up':
          window.scrollBy(0, -100);
          showSuccess('Scrolling up');
          break;
        case 'scroll down':
          window.scrollBy(0, 100);
          showSuccess('Scrolling down');
          break;
      }
    };

    this.recognition.onerror = (event) => {
      showError(`Speech recognition error: ${event.error}`);
    };
  }

  start() {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  simulateMouseEvent(eventType) {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(event);
  }
}