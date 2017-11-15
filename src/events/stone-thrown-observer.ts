import { StoneThrownEvent } from './stone-thrown-event';

export interface StoneThrownObserver {

  /**
   * @param {StoneThrownEvent} event
   */
  onStoneThrown(event: StoneThrownEvent): void;

}
