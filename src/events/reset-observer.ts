import { ResetEvent } from './reset-event';

export interface ResetObserver {

  /**
   * @param {ResetEvent} event
   */
  onReset(event: ResetEvent): void;

}
