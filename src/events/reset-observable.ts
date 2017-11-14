import { ResetEvent } from './reset-event';
import { ResetObserver } from './reset-observer';

export interface ResetObservable {
  addResetObserver(observer: ResetObserver): void;
  removeResetObserver(observer: ResetObserver): void;
  notifyResetObservers(event: ResetEvent): void;
}
