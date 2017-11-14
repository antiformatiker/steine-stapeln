import { StoneThrownEvent } from './stone-thrown-event';
import { StoneThrownObserver } from './stone-thrown-observer';

export interface StoneThrownObservable {
  addStoneThrownObserver(observer: StoneThrownObserver): void;
  removeStoneThrownObserver(observer: StoneThrownObserver): void;
  notifyStoneThrownObservers(event: StoneThrownEvent): void;
}
