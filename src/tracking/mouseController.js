import { showWarning } from '../utils/notificationUtils.js';

class MouseController {
  constructor() {
    this.smoothingFactor = 0.3;
    this.currentX = window.innerWidth / 2;
    this.currentY = window.innerHeight / 2;
    this.isEnabled = false;
    this.lastClickTime = 0;
    this.clickCooldown = 500;
    this.setupPermissions();
  }

  async setupPermissions() {
    try {
      // Check if the browser supports the Permissions API
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'system-events' });
        if (result.state === 'granted') {
          this.isEnabled = true;
        } else {
          showWarning('System control permissions not granted. Some features may be limited.');
        }
      }
    } catch (error) {
      console.warn('System control permissions not available:', error);
    }
  }

  enable() {
    this.isEnabled = true;
    console.log('Mouse controller enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('Mouse controller disabled');
  }

  updatePosition(x, y) {
    if (!this.isEnabled) return;

    // Convert eye tracking coordinates to screen coordinates
    const screenX = (x / 100) * window.innerWidth;
    const screenY = (y / 100) * window.innerHeight;

    // Apply smoothing
    this.currentX = this.lerp(this.currentX, screenX, this.smoothingFactor);
    this.currentY = this.lerp(this.currentY, screenY, this.smoothingFactor);

    this.moveCursor(this.currentX, this.currentY);
  }

  click() {
    if (!this.isEnabled) return;

    const now = Date.now();
    if (now - this.lastClickTime < this.clickCooldown) return;

    this.lastClickTime = now;
    this.triggerClick();
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  moveCursor(x, y) {
    const event = new CustomEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      detail: { x, y }
    });
    document.dispatchEvent(event);
  }

  triggerClick() {
    const event = new CustomEvent('click', {
      bubbles: true,
      cancelable: true,
      detail: { x: this.currentX, y: this.currentY }
    });
    document.dispatchEvent(event);
  }
}

export const mouseController = new MouseController();