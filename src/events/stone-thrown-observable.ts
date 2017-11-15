import { StoneThrownEvent } from './stone-thrown-event';
import { StoneThrownObserver } from './stone-thrown-observer';

export interface StoneThrownObservable {

  /**
   * @param {StoneThrownObserver} observer
   */
  addStoneThrownObserver(observer: StoneThrownObserver): void;

  /**
   * @param {StoneThrownObserver} observer
   */
  removeStoneThrownObserver(observer: StoneThrownObserver): void;

  /**
   * @param {StoneThrownEvent} event
   */
  notifyStoneThrownObservers(event: StoneThrownEvent): void;

}
