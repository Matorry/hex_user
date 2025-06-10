export interface UserEventBus {
  publish(event: { type: string; data: any }): Promise<void>;
}
