import { computed, signal } from "@angular/core";

export const currentUser = signal<any | null>(null);

export const userInfoLoading = signal<boolean>(false);

export const notifications = signal<any>([]);

export const approveNotifications = signal<any>([]);

export const allNotisWithoutFilter = signal<any>([]);

export const notificationsLoading = signal<boolean>(false);

export const codeEmail = signal<string | null>(null);

export const codeType = signal<string | null>(null);

//export const email = signal<string | null>(null);