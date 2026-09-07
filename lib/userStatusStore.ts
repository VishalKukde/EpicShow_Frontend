"use client";

const SUSPENDED_USERS_KEY = "epicshow_suspended_user_statuses_v1";

export type UserAccountStatus = "Active" | "Suspended" | "Deactivated";
export type UserStatusMap = Record<string, UserAccountStatus>;

const DEFAULT_INITIAL_STATUSES: UserStatusMap = {
    "rohan.k@epicshow.in": "Suspended",
};

export function getStoredUserStatuses(): UserStatusMap {
    if (typeof window === "undefined") return DEFAULT_INITIAL_STATUSES;
    try {
        const raw = localStorage.getItem(SUSPENDED_USERS_KEY);
        if (raw) {
            return { ...DEFAULT_INITIAL_STATUSES, ...JSON.parse(raw) };
        }
    } catch {
        // Return default initial map on error
    }
    return DEFAULT_INITIAL_STATUSES;
}

export function setUserAccountStatus(email: string, status: UserAccountStatus) {
    if (typeof window === "undefined") return;
    try {
        const current = getStoredUserStatuses();
        const normalizedEmail = email.toLowerCase().trim();
        current[normalizedEmail] = status;
        localStorage.setItem(SUSPENDED_USERS_KEY, JSON.stringify(current));
    } catch (e) {
        console.error("Failed to update user status in localStorage:", e);
    }
}

export function isAccountSuspendedOrDeactivated(email: string): boolean {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    const statuses = getStoredUserStatuses();
    const st = statuses[normalized];
    return st === "Suspended" || st === "Deactivated";
}
