import { ResetEvent } from './reset-event';
import { ResetObserver } from './reset-observer';

export interface ResetObservable {

  /**
   * @param {ResetObserver} observer
   */
  addResetObserver(observer: ResetObserver): void;

  /**
   * @param {ResetObserver} observer
   */
  removeResetObserver(observer: ResetObserver): void;

  /**
   * @param {ResetEvent} event
   */
  notifyResetObservers(event: ResetEvent): void;

}
