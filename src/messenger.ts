import './messenger.scss';

export class Messenger {

  private textarea: HTMLTextAreaElement;

  constructor(private id: string) {
    this.init();
  }

  public print(message: string): void {
    this.textarea.value += message + '\n';
    this.scrollToBottom();
  }

  public reset() {
    this.textarea.value = '';
  }

  private init() {
    this.textarea = document.getElementById(this.id) as HTMLTextAreaElement;
    this.reset();
  }

  private scrollToBottom(): void {
    this.textarea.scrollTop = this.textarea.scrollHeight;
  }

}
