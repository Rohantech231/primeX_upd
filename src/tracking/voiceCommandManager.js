import { showSuccess, showError } from '../utils/notificationUtils.js';
import { SpeechRecognitionService } from '../services/speechRecognition.js';

export class VoiceCommandManager {
  constructor() {
    try {
      this.recognition = SpeechRecognitionService.create();
      this.isListening = false;
      this.setupRecognition();
    } catch (error) {
      showError('Speech recognition not available');
      this.isListening = false;
      this.recognition = null;
    }
  }

  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      showSuccess('Voice recognition active');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      // Restart if we were supposed to be listening
      if (this.shouldBeListening) {
        this.start();
      }
    };

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      this.handleCommand(command);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      showError(`Speech recognition error: ${event.error}`);
    };
  }

  handleCommand(command) {
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
        window.scrollBy({ top: -100, behavior: 'smooth' });
        showSuccess('Scrolling up');
        break;
      case 'scroll down':
        window.scrollBy({ top: 100, behavior: 'smooth' });
        showSuccess('Scrolling down');
        break;
    }
  }

  start() {
    if (!this.recognition) return;
    
    try {
      if (!this.isListening) {
        this.shouldBeListening = true;
        this.recognition.start();
      }
    } catch (error) {
      showError('Failed to start voice recognition');
    }
  }

  stop() {
    if (!this.recognition) return;
    
    try {
      this.shouldBeListening = false;
      if (this.isListening) {
        this.recognition.stop();
      }
    } catch (error) {
      console.error('Error stopping recognition:', error);
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