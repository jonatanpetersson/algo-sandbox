export class Controls {
  forward: boolean;
  right: boolean;
  reverse: boolean;
  left: boolean;
  constructor() {
    this.forward = false;
    this.right = false;
    this.reverse = false;
    this.left = false;
    this._addKeyboardListeners();
  }

  private _addKeyboardListeners() {
    document.onkeydown = this.addListener('down');
    document.onkeyup = this.addListener('up');
  }

  addListener(keyState: 'down' | 'up') {
    const value = keyState === 'down' ? true : false;
    return (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'ArrowUp':
          this.forward = value;
          break;
        case 'ArrowRight':
          this.right = value;
          break;
        case 'ArrowDown':
          this.reverse = value;
          break;
        case 'ArrowLeft':
          this.left = value;
          break;
      }
    };
  }
}
