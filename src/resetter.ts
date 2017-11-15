import { ResetEvent } from './events/reset-event';
import { ResetObservable } from './events/reset-observable';
import { ResetObserver } from './events/reset-observer';

export class Resetter implements ResetObservable {

  private htmlObject: HTMLButtonElement;
  private resetObservers: ResetObserver[];

  /**
   * @param {string} id
   */
  constructor(id: string) {
    this.resetObservers = [];
    this.htmlObject = document.getElementById(id) as HTMLButtonElement;
    this.htmlObject.onclick = (event: MouseEvent) => this.notifyResetObservers(new ResetEvent());
  }

  /**
   * @param {ResetObserver} observer
   */
  public addResetObserver(observer: ResetObserver): void {
    if (observer) {
      this.resetObservers.push(observer);
    }
  }

  /**
   * @param {ResetObserver} observer
   */
  public removeResetObserver(observer: ResetObserver): void {
    if (observer) {
      this.resetObservers.forEach(
        (resetObserver: ResetObserver, index: number, observers: ResetObserver[]) => {
          if (resetObserver === observer) {
            observers.splice(index, 1);
          }
        }
      );
    }
  }

  /**
   * @param {ResetEvent} event
   */
  public notifyResetObservers(event: ResetEvent): void {
    this.resetObservers.forEach((resetObserver: ResetObserver) => resetObserver.onReset(event));
  }

}
