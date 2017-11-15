import './scss/messenger.scss';

export class Messenger {

  private textarea: HTMLTextAreaElement;

  /**
   * @param {string} id
   */
  constructor(private id: string) {
    this.init();
  }

  /**
   * @param {string} message
   */
  public print(message: string): void {
    this.textarea.value += message + '\n';
    this.scrollToBottom();
  }

  public reset(): void {
    this.textarea.value = '';
  }

  private init(): void {
    this.textarea = document.getElementById(this.id) as HTMLTextAreaElement;
    this.reset();
  }

  private scrollToBottom(): void {
    this.textarea.scrollTop = this.textarea.scrollHeight;
  }

}
