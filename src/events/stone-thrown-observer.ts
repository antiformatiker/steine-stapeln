import { StoneThrownEvent } from './stone-thrown-event';

export interface StoneThrownObserver {
  onStoneThrown(event: StoneThrownEvent): void;
}
