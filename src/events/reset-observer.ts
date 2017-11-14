import { ResetEvent } from './reset-event';

export interface ResetObserver {
  onReset(event: ResetEvent): void;
}
