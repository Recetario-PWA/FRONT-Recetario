declare module '@pusher/push-notifications-web' {
  export default class PushNotifications {
    constructor(options: { instanceId: string });
    start(): Promise<void>;
    addDeviceInterest(interest: string): Promise<void>;
    removeDeviceInterest(interest: string): Promise<void>;
    getDeviceInterests(): Promise<string[]>;
    clearDeviceInterests(): Promise<void>;
    setUserId(
      userId: string,
      tokenProvider: {
        authUrl: string;
        getAuthHeaders?: () => Record<string, string>;
      }
    ): Promise<void>;
  }
}
