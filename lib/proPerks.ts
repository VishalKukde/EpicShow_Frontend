export type Membership = "free" | "pro";

export function getTicketLimit(membership?: Membership | string | null) {
  return membership === "pro" ? 5 : 2;
}
