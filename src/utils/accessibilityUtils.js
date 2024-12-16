// Handles keyboard shortcuts and voice commands for accessibility
export class AccessibilityController {
  constructor() {
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Space bar for click
      if (event.code === 'Space') {
        this.triggerClick();
      }
    });
  }

  triggerClick() {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(clickEvent);
  }
}