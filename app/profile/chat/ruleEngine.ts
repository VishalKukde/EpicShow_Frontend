export type SupportCategory =
  | "login_auth"
  | "booking"
  | "payment_wallet"
  | "account_settings"
  | "security"
  | "app_info";

export type QuickReplyAction =
  | { type: "node"; target: string }
  | { type: "intent"; intentId: string }
  | { type: "back" }
  | { type: "reset" }
  | { type: "clear" }
  | { type: "escalate" }
  | { type: "categories" }
  | { type: "navigate"; href: string };

export type QuickReply = {
  label: string;
  action: QuickReplyAction;
};

export type DecisionNode = {
  id: string;
  text: string;
  quickReplies?: QuickReply[];
};

export type RuleIntent = {
  id: string;
  category: SupportCategory;
  label: string;
  nodeId: string;
  keywords: string[];
};

const categoryLabels: Record<SupportCategory, string> = {
  login_auth: "Login & Authentication",
  booking: "Booking Issues",
  payment_wallet: "Payment & Wallet",
  account_settings: "Account & Settings",
  security: "Security",
  app_info: "Application Information",
};

export const intents: RuleIntent[] = [
  {
    id: "greeting",
    category: "app_info",
    label: "Greeting",
    nodeId: "greeting",
    keywords: ["hi", "hii", "hello", "hey", "heyy", "namaste", "good morning", "good evening"],
  },
  {
    id: "whats_up",
    category: "app_info",
    label: "What's up",
    nodeId: "whats_up",
    keywords: ["whats up", "whatsup", "whatssup", "whatssapp", "wassup", "sup"],
  },
  {
    id: "how_are_you",
    category: "app_info",
    label: "How are you",
    nodeId: "how_are_you",
    keywords: ["how are you", "how r u", "how ru", "kaise ho", "how are u"],
  },
  {
    id: "who_are_you",
    category: "app_info",
    label: "Who are you",
    nodeId: "who_are_you",
    keywords: ["who are you", "whoc are you", "what are you", "about you", "your name"],
  },
  {
    id: "tech_stack_info",
    category: "app_info",
    label: "Tech stack",
    nodeId: "tech_stack_info",
    keywords: ["tech stack", "technology stack", "stack used", "what tech use", "which tech"],
  },
  {
    id: "developer_info",
    category: "app_info",
    label: "Developer details",
    nodeId: "developer_info",
    keywords: [
      "who built this",
      "who made this",
      "developer details",
      "developer detail",
      "devloper",
      "creator",
      "author",
      "build by",
      "built by",
    ],
  },
  {
    id: "app_overview",
    category: "app_info",
    label: "Application overview",
    nodeId: "app_overview",
    keywords: ["what is this app", "about this app", "application info", "app details", "what this application does"],
  },
  {
    id: "login_not_working",
    category: "login_auth",
    label: "Login not working",
    nodeId: "login_not_working",
    keywords: ["login not working", "cant login", "cannot login", "sign in issue", "login error"],
  },
  {
    id: "forgot_password",
    category: "login_auth",
    label: "Forgot password",
    nodeId: "forgot_password",
    keywords: ["forgot password", "reset password", "password reset"],
  },
  {
    id: "reset_email_missing",
    category: "login_auth",
    label: "Reset email not received",
    nodeId: "reset_email_missing",
    keywords: ["reset email", "email not received", "password reset email"],
  },
  {
    id: "logged_out_other_device",
    category: "login_auth",
    label: "Logged out from another device",
    nodeId: "logged_out_other_device",
    keywords: ["logged out", "another device", "logout on other device"],
  },
  {
    id: "token_expired",
    category: "login_auth",
    label: "Token expired",
    nodeId: "token_expired",
    keywords: ["token expired", "session expired", "jwt expired"],
  },
  {
    id: "remember_me_issue",
    category: "login_auth",
    label: "Remember me issue",
    nodeId: "remember_me_issue",
    keywords: ["remember me", "stay logged in", "keep me logged in"],
  },
  {
    id: "payment_deducted_no_ticket",
    category: "booking",
    label: "Payment deducted but no ticket",
    nodeId: "payment_deducted_no_ticket",
    keywords: ["payment deducted", "money deducted no ticket", "paid but no ticket"],
  },
  {
    id: "booking_failed",
    category: "booking",
    label: "Booking failed",
    nodeId: "booking_failed",
    keywords: ["booking failed", "failed booking", "could not book"],
  },
  {
    id: "ticket_expired",
    category: "booking",
    label: "Ticket expired",
    nodeId: "ticket_expired",
    keywords: ["ticket expired", "booking expired", "expired ticket"],
  },
  {
    id: "cancel_booking",
    category: "booking",
    label: "Cancel booking",
    nodeId: "cancel_booking",
    keywords: ["cancel booking", "booking cancellation", "cancel my ticket"],
  },
  {
    id: "refund_status",
    category: "booking",
    label: "Refund status",
    nodeId: "refund_status",
    keywords: ["refund status", "where is refund", "refund pending"],
  },
  {
    id: "booking_history",
    category: "booking",
    label: "Booking history",
    nodeId: "booking_history",
    keywords: ["booking history", "past bookings", "my bookings"],
  },
  {
    id: "show_timing_confusion",
    category: "booking",
    label: "Show timing confusion",
    nodeId: "show_timing_confusion",
    keywords: ["show timing", "timing confusion", "wrong show time"],
  },
  {
    id: "payment_failed",
    category: "payment_wallet",
    label: "Payment failed",
    nodeId: "payment_failed_q1",
    keywords: ["payment failed", "transaction failed", "unable to pay"],
  },
  {
    id: "razorpay_error",
    category: "payment_wallet",
    label: "Razorpay errors",
    nodeId: "razorpay_error",
    keywords: ["razorpay", "razorpay error", "rzp"],
  },
  {
    id: "wallet_not_updated",
    category: "payment_wallet",
    label: "Wallet not updated",
    nodeId: "wallet_not_updated",
    keywords: ["wallet not updated", "wallet balance", "wallet topup missing"],
  },
  {
    id: "reward_missing",
    category: "payment_wallet",
    label: "Reward points missing",
    nodeId: "reward_missing",
    keywords: ["reward points missing", "points missing", "rewards not added"],
  },
  {
    id: "refund_delay",
    category: "payment_wallet",
    label: "Refund delay",
    nodeId: "refund_delay",
    keywords: ["refund delay", "refund taking long", "refund not received"],
  },
  {
    id: "change_password",
    category: "account_settings",
    label: "Change password",
    nodeId: "change_password",
    keywords: ["change password", "update password", "new password"],
  },
  {
    id: "update_profile",
    category: "account_settings",
    label: "Update profile",
    nodeId: "update_profile",
    keywords: ["update profile", "edit profile", "change profile"],
  },
  {
    id: "dark_mode_toggle",
    category: "account_settings",
    label: "Dark mode toggle",
    nodeId: "dark_mode_toggle",
    keywords: ["dark mode", "light mode", "theme"],
  },
  {
    id: "membership_upgrade",
    category: "account_settings",
    label: "Membership upgrade",
    nodeId: "membership_upgrade",
    keywords: ["membership upgrade", "upgrade pro", "subscription"],
  },
  {
    id: "role_explanation",
    category: "account_settings",
    label: "Role explanation",
    nodeId: "role_explanation",
    keywords: ["user vs admin", "role", "admin access"],
  },
  {
    id: "suspicious_login",
    category: "security",
    label: "Suspicious login",
    nodeId: "suspicious_login",
    keywords: ["suspicious login", "unknown login", "unauthorized login"],
  },
  {
    id: "password_change_notification",
    category: "security",
    label: "Password change notification",
    nodeId: "password_change_notification",
    keywords: ["password changed notification", "password changed email", "didnt change password"],
  },
  {
    id: "logout_all_devices",
    category: "security",
    label: "Logout from all devices",
    nodeId: "logout_all_devices",
    keywords: ["logout all devices", "log out all", "sign out all devices"],
  },
  {
    id: "session_expired",
    category: "security",
    label: "Session expired",
    nodeId: "session_expired",
    keywords: ["session expired", "access token expired", "please login again"],
  },
  {
    id: "booking_flow",
    category: "app_info",
    label: "Booking flow explanation",
    nodeId: "booking_flow",
    keywords: ["booking flow", "how booking works", "steps to book"],
  },
  {
    id: "show_expiry_logic",
    category: "app_info",
    label: "Show expiry logic",
    nodeId: "show_expiry_logic",
    keywords: ["show expiry", "lock expiry", "seat lock expiry"],
  },
  {
    id: "booking_status_meanings",
    category: "app_info",
    label: "Booking status meanings",
    nodeId: "booking_status_meanings",
    keywords: ["booking status", "pending paid cancelled", "status meaning"],
  },
  {
    id: "refund_timeline",
    category: "app_info",
    label: "Refund processing timeline",
    nodeId: "refund_timeline",
    keywords: ["refund timeline", "refund processing", "how long refund"],
  },
  {
    id: "reward_system",
    category: "app_info",
    label: "Reward system explanation",
    nodeId: "reward_system",
    keywords: ["reward system", "reward points", "points earn redeem"],
  },
  {
    id: "trending_movies",
    category: "app_info",
    label: "Trending movies",
    nodeId: "trending_movies",
    keywords: [
      "trending movie",
      "trending movies",
      "popular movies",
      "top movies",
      "whats trending",
      "latest trending",
    ],
  },
  {
    id: "recommended_movies",
    category: "app_info",
    label: "Recommended movies",
    nodeId: "recommended_movies",
    keywords: [
      "recommend movie",
      "recommended movie",
      "movie recommendation",
      "suggest movie",
      "what should i watch",
      "best movie for me",
    ],
  },
  {
    id: "nearby_shows",
    category: "app_info",
    label: "Nearby shows",
    nodeId: "nearby_shows",
    keywords: [
      "nearby show",
      "shows near me",
      "cinema near me",
      "theatre near me",
      "theater near me",
      "near by shows",
    ],
  },
  {
    id: "ticket_price_info",
    category: "app_info",
    label: "Ticket price info",
    nodeId: "ticket_price_info",
    keywords: [
      "ticket rate",
      "ticket price",
      "price per ticket",
      "ticket cost",
      "ticket charges",
    ],
  },
  {
    id: "movie_details_help",
    category: "app_info",
    label: "Movie details",
    nodeId: "movie_details_help",
    keywords: [
      "movie details",
      "movie information",
      "about movie",
      "cast duration genre",
      "movie info",
    ],
  },
  {
    id: "offers_discounts",
    category: "app_info",
    label: "Offers and discounts",
    nodeId: "offers_discounts",
    keywords: [
      "offer",
      "offers",
      "discount",
      "coupon",
      "promo code",
      "cashback",
      "deals",
    ],
  },
  {
    id: "ticket_details_help",
    category: "app_info",
    label: "Ticket details",
    nodeId: "ticket_details_help",
    keywords: [
      "ticket details",
      "booking details",
      "my ticket info",
      "seat details",
      "ticket summary",
    ],
  },
  {
    id: "sports_unavailable",
    category: "app_info",
    label: "Sports availability",
    nodeId: "sports_unavailable",
    keywords: [
      "sports unavailable",
      "sport booking unavailable",
      "cant book sports",
      "sports ticket unavailable",
      "cricket ticket unavailable",
    ],
  },
  {
    id: "best_showtime_recommendation",
    category: "app_info",
    label: "Best showtime recommendation",
    nodeId: "best_showtime_recommendation",
    keywords: [
      "best showtime",
      "best slot",
      "recommended showtime",
      "which showtime",
      "best time to watch",
    ],
  },
];

export const nodes: Record<string, DecisionNode> = {
  welcome: {
    id: "welcome",
    text: "Hello! I am your rule-based support assistant. Choose a support category below or type your issue.",
    quickReplies: [
      { label: categoryLabels.login_auth, action: { type: "node", target: "category_login_auth" } },
      { label: categoryLabels.booking, action: { type: "node", target: "category_booking" } },
      { label: categoryLabels.payment_wallet, action: { type: "node", target: "category_payment_wallet" } },
      { label: categoryLabels.account_settings, action: { type: "node", target: "category_account_settings" } },
      { label: categoryLabels.security, action: { type: "node", target: "category_security" } },
      { label: categoryLabels.app_info, action: { type: "node", target: "category_app_info" } },
    ],
  },

  category_login_auth: {
    id: "category_login_auth",
    text: "Login & Authentication: choose an issue.",
    quickReplies: [
      { label: "Login not working", action: { type: "intent", intentId: "login_not_working" } },
      { label: "Forgot password", action: { type: "intent", intentId: "forgot_password" } },
      { label: "Reset email not received", action: { type: "intent", intentId: "reset_email_missing" } },
      { label: "Token expired", action: { type: "intent", intentId: "token_expired" } },
      { label: "Remember me issue", action: { type: "intent", intentId: "remember_me_issue" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  category_booking: {
    id: "category_booking",
    text: "Booking Issues: choose an issue.",
    quickReplies: [
      { label: "Payment deducted but no ticket", action: { type: "intent", intentId: "payment_deducted_no_ticket" } },
      { label: "Booking failed", action: { type: "intent", intentId: "booking_failed" } },
      { label: "Cancel booking", action: { type: "intent", intentId: "cancel_booking" } },
      { label: "Refund status", action: { type: "intent", intentId: "refund_status" } },
      { label: "Booking history", action: { type: "intent", intentId: "booking_history" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  category_payment_wallet: {
    id: "category_payment_wallet",
    text: "Payment & Wallet: choose an issue.",
    quickReplies: [
      { label: "Payment failed", action: { type: "intent", intentId: "payment_failed" } },
      { label: "Razorpay errors", action: { type: "intent", intentId: "razorpay_error" } },
      { label: "Wallet not updated", action: { type: "intent", intentId: "wallet_not_updated" } },
      { label: "Reward points missing", action: { type: "intent", intentId: "reward_missing" } },
      { label: "Refund delay", action: { type: "intent", intentId: "refund_delay" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  category_account_settings: {
    id: "category_account_settings",
    text: "Account & Settings: choose an issue.",
    quickReplies: [
      { label: "Change password", action: { type: "intent", intentId: "change_password" } },
      { label: "Update profile", action: { type: "intent", intentId: "update_profile" } },
      { label: "Dark mode toggle", action: { type: "intent", intentId: "dark_mode_toggle" } },
      { label: "Membership upgrade", action: { type: "intent", intentId: "membership_upgrade" } },
      { label: "Role explanation", action: { type: "intent", intentId: "role_explanation" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  category_security: {
    id: "category_security",
    text: "Security: choose an issue.",
    quickReplies: [
      { label: "Suspicious login", action: { type: "intent", intentId: "suspicious_login" } },
      { label: "Password change notification", action: { type: "intent", intentId: "password_change_notification" } },
      { label: "Logout from all devices", action: { type: "intent", intentId: "logout_all_devices" } },
      { label: "Session expired", action: { type: "intent", intentId: "session_expired" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  category_app_info: {
    id: "category_app_info",
    text: "Application Information: choose a topic.",
    quickReplies: [
      { label: "Hi / Hello", action: { type: "intent", intentId: "greeting" } },
      { label: "Trending movies", action: { type: "intent", intentId: "trending_movies" } },
      { label: "Recommended movies", action: { type: "intent", intentId: "recommended_movies" } },
      { label: "Nearby shows", action: { type: "intent", intentId: "nearby_shows" } },
      { label: "Ticket price info", action: { type: "intent", intentId: "ticket_price_info" } },
      { label: "Offers and discounts", action: { type: "intent", intentId: "offers_discounts" } },
      { label: "Movie details", action: { type: "intent", intentId: "movie_details_help" } },
      { label: "Ticket details", action: { type: "intent", intentId: "ticket_details_help" } },
      { label: "Sports availability", action: { type: "intent", intentId: "sports_unavailable" } },
      { label: "Who are you?", action: { type: "intent", intentId: "who_are_you" } },
      { label: "Tech stack", action: { type: "intent", intentId: "tech_stack_info" } },
      { label: "Developer details", action: { type: "intent", intentId: "developer_info" } },
      { label: "Booking flow explanation", action: { type: "intent", intentId: "booking_flow" } },
      { label: "Best showtime recommendation", action: { type: "intent", intentId: "best_showtime_recommendation" } },
      { label: "Show expiry logic", action: { type: "intent", intentId: "show_expiry_logic" } },
      { label: "Booking status meanings", action: { type: "intent", intentId: "booking_status_meanings" } },
      { label: "Refund timeline", action: { type: "intent", intentId: "refund_timeline" } },
      { label: "Reward system", action: { type: "intent", intentId: "reward_system" } },
      { label: "Back", action: { type: "back" } },
    ],
  },

  login_not_working: {
    id: "login_not_working",
    text: "Check email/password spelling, then try again. If it still fails, use Forgot Password. We never ask for your password or OTP in chat.",
    quickReplies: [
      { label: "Forgot password", action: { type: "intent", intentId: "forgot_password" } },
      { label: "Still need help?", action: { type: "escalate" } },
    ],
  },
  forgot_password: {
    id: "forgot_password",
    text: "Go to Login > Forgot Password and request a reset link. Use the newest reset email only.",
    quickReplies: [
      { label: "Reset email not received", action: { type: "intent", intentId: "reset_email_missing" } },
      { label: "Back", action: { type: "back" } },
    ],
  },
  reset_email_missing: {
    id: "reset_email_missing",
    text: "Check spam/promotions, verify email spelling, and wait 2-5 minutes. If still missing, request another reset link.",
    quickReplies: [{ label: "Still need help?", action: { type: "escalate" } }],
  },
  logged_out_other_device: {
    id: "logged_out_other_device",
    text: "A login/logout on another device can invalidate your session. Please login again and keep Remember Me enabled if needed.",
    quickReplies: [{ label: "Remember me issue", action: { type: "intent", intentId: "remember_me_issue" } }],
  },
  token_expired: {
    id: "token_expired",
    text: "Your session token expired. Please login again. If this happens often, check Remember Me and avoid clearing browser storage.",
    quickReplies: [{ label: "Remember me issue", action: { type: "intent", intentId: "remember_me_issue" } }],
  },
  remember_me_issue: {
    id: "remember_me_issue",
    text: "Enable Remember Me on login. Also avoid private mode or storage cleanup extensions, as they clear saved session data.",
    quickReplies: [{ label: "Still need help?", action: { type: "escalate" } }],
  },

  payment_deducted_no_ticket: {
    id: "payment_deducted_no_ticket",
    text: "If amount was deducted but ticket is missing, wait 10-15 minutes for reconciliation. Then check Booking History.",
    quickReplies: [
      { label: "Refund status", action: { type: "intent", intentId: "refund_status" } },
      { label: "Booking history", action: { type: "intent", intentId: "booking_history" } },
    ],
  },
  booking_failed: {
    id: "booking_failed",
    text: "Booking may fail due to seat lock expiry or payment interruption. Retry with fresh seats and stable network.",
    quickReplies: [{ label: "Show expiry logic", action: { type: "intent", intentId: "show_expiry_logic" } }],
  },
  ticket_expired: {
    id: "ticket_expired",
    text: "Expired tickets cannot be used. For payment-linked failures, refund is usually auto-processed within 3-7 business days.",
    quickReplies: [{ label: "Refund timeline", action: { type: "intent", intentId: "refund_timeline" } }],
  },
  cancel_booking: {
    id: "cancel_booking",
    text: "Go to Profile > Bookings, open your ticket, and use Cancel if cancellation is allowed for that show/time.",
    quickReplies: [{ label: "Refund status", action: { type: "intent", intentId: "refund_status" } }],
  },
  refund_status: {
    id: "refund_status",
    text: "You can track refund progress in Payments/Booking history. Bank reflection usually takes 3-7 business days.",
    quickReplies: [{ label: "Refund timeline", action: { type: "intent", intentId: "refund_timeline" } }],
  },
  booking_history: {
    id: "booking_history",
    text: "Open Profile > Bookings to view all past and current tickets with status and payment details.",
  },
  show_timing_confusion: {
    id: "show_timing_confusion",
    text: "Always verify cinema, date, and slot before payment. Timing shown in booking summary is final.",
  },

  payment_failed_q1: {
    id: "payment_failed_q1",
    text: "Did money get deducted?",
    quickReplies: [
      { label: "Yes", action: { type: "node", target: "payment_failed_deducted" } },
      { label: "No", action: { type: "node", target: "payment_failed_not_deducted" } },
    ],
  },
  payment_failed_deducted: {
    id: "payment_failed_deducted",
    text: "If deducted, wait 10-15 minutes for sync. If booking remains failed, refund is usually processed in 3-7 business days.",
    quickReplies: [{ label: "Still need help?", action: { type: "escalate" } }],
  },
  payment_failed_not_deducted: {
    id: "payment_failed_not_deducted",
    text: "If not deducted, please retry payment with stable network and ensure your UPI/card session is active.",
  },
  razorpay_error: {
    id: "razorpay_error",
    text: "Razorpay errors are often temporary network/session issues. Retry once after refreshing payment page.",
    quickReplies: [{ label: "Payment failed", action: { type: "intent", intentId: "payment_failed" } }],
  },
  wallet_not_updated: {
    id: "wallet_not_updated",
    text: "Wallet updates may take a short sync delay. Refresh wallet page and check recent wallet transactions.",
    quickReplies: [{ label: "Still need help?", action: { type: "escalate" } }],
  },
  reward_missing: {
    id: "reward_missing",
    text: "Rewards are credited based on booking rules (amount threshold and redeem conditions). Check reward history first.",
    quickReplies: [{ label: "Reward system", action: { type: "intent", intentId: "reward_system" } }],
  },
  refund_delay: {
    id: "refund_delay",
    text: "Refunds usually complete within 3-7 business days depending on provider and bank.",
    quickReplies: [{ label: "Still need help?", action: { type: "escalate" } }],
  },

  change_password: {
    id: "change_password",
    text: "Go to Profile > Security > Change Password. For safety, all sessions may require re-login after password change.",
  },
  update_profile: {
    id: "update_profile",
    text: "Go to Profile > Account Settings to update your name, avatar, email, and preferences.",
  },
  dark_mode_toggle: {
    id: "dark_mode_toggle",
    text: "Use theme toggle in profile/navbar. Your selected theme is saved for future sessions.",
  },
  membership_upgrade: {
    id: "membership_upgrade",
    text: "Go to Profile > Subscription and choose monthly, quarterly, or yearly Pro plans.",
  },
  role_explanation: {
    id: "role_explanation",
    text: "User role is for booking/customer actions. Admin role is for management operations and is not publicly self-assignable.",
  },

  suspicious_login: {
    id: "suspicious_login",
    text: "If login looks suspicious, change password immediately and logout from all devices from Security settings.",
    quickReplies: [{ label: "Logout from all devices", action: { type: "intent", intentId: "logout_all_devices" } }],
  },
  password_change_notification: {
    id: "password_change_notification",
    text: "If you received a password-change notification without action, reset password now and review recent sessions.",
  },
  logout_all_devices: {
    id: "logout_all_devices",
    text: "Open Profile > Security and use global logout/session controls. Then login again on trusted devices only.",
  },
  session_expired: {
    id: "session_expired",
    text: "Session expiry is normal for security. Login again to continue. Use Remember Me for longer session persistence.",
  },

  greeting: {
    id: "greeting",
    text: "Hi! I can help with bookings, payments, wallet, account, security, and app information.",
    quickReplies: [
      { label: "How are you?", action: { type: "intent", intentId: "how_are_you" } },
      { label: "Who are you?", action: { type: "intent", intentId: "who_are_you" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  whats_up: {
    id: "whats_up",
    text: "All good here. I am ready to help with any issue in this app.",
    quickReplies: [
      { label: "Who are you?", action: { type: "intent", intentId: "who_are_you" } },
      { label: "Tech stack", action: { type: "intent", intentId: "tech_stack_info" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  how_are_you: {
    id: "how_are_you",
    text: "I am doing well. I am a rule-based support assistant and I can guide you through app issues quickly.",
    quickReplies: [
      { label: "What is this app?", action: { type: "intent", intentId: "app_overview" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  who_are_you: {
    id: "who_are_you",
    text: "I am the in-app rule-based support chatbot. I match your message to support rules and give instant guidance.",
    quickReplies: [
      { label: "Tech stack", action: { type: "intent", intentId: "tech_stack_info" } },
      { label: "Developer details", action: { type: "intent", intentId: "developer_info" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  tech_stack_info: {
    id: "tech_stack_info",
    text: "Tech stack: Next.js App Router + React + TypeScript + Tailwind CSS on frontend, and Node.js + Express + MongoDB + Mongoose on backend, with Razorpay and JWT auth flows.",
    quickReplies: [
      { label: "Developer details", action: { type: "intent", intentId: "developer_info" } },
      { label: "What is this app?", action: { type: "intent", intentId: "app_overview" } },
    ],
  },
  developer_info: {
    id: "developer_info",
    text: "This application is built by Vishal Kukde (full-stack developer). You can also check Profile > About for more details and links.",
    quickReplies: [
      { label: "Tech stack", action: { type: "intent", intentId: "tech_stack_info" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  app_overview: {
    id: "app_overview",
    text: "This is a full-stack movie booking platform with secure authentication, seat locking, online payments, wallet top-up, rewards, booking lifecycle, and profile tools.",
    quickReplies: [
      { label: "Tech stack", action: { type: "intent", intentId: "tech_stack_info" } },
      { label: "Support categories", action: { type: "categories" } },
    ],
  },
  trending_movies: {
    id: "trending_movies",
    text: "Trending list updates frequently. Right now, check the Movies page first for top picks and high-demand shows. 🎬 If you share your preferred language/genre, I can narrow it down.",
    quickReplies: [
      { label: "Recommended movies", action: { type: "intent", intentId: "recommended_movies" } },
      { label: "Nearby shows", action: { type: "intent", intentId: "nearby_shows" } },
      { label: "Ticket price info", action: { type: "intent", intentId: "ticket_price_info" } },
    ],
  },
  recommended_movies: {
    id: "recommended_movies",
    text: "For better recommendations, match by genre + mood + runtime. Quick guide: Action/Thriller for fast pace, Drama for story depth, Animation/Family for group viewing.",
    quickReplies: [
      { label: "Trending movies", action: { type: "intent", intentId: "trending_movies" } },
      { label: "Best showtime recommendation", action: { type: "intent", intentId: "best_showtime_recommendation" } },
      { label: "Nearby shows", action: { type: "intent", intentId: "nearby_shows" } },
    ],
  },
  nearby_shows: {
    id: "nearby_shows",
    text: "To find nearby shows quickly: open Movies, select a title, then review cinemas sorted by distance and available slots. Keep location enabled for more accurate nearby results.",
    quickReplies: [
      { label: "Best showtime recommendation", action: { type: "intent", intentId: "best_showtime_recommendation" } },
      { label: "Ticket price info", action: { type: "intent", intentId: "ticket_price_info" } },
    ],
  },
  ticket_price_info: {
    id: "ticket_price_info",
    text: "Ticket rates vary by city, cinema, seat type, format (2D/3D/IMAX), and showtime. Weekday matinee is usually lower priced than peak evening/weekend slots.",
    quickReplies: [
      { label: "Best showtime recommendation", action: { type: "intent", intentId: "best_showtime_recommendation" } },
      { label: "Nearby shows", action: { type: "intent", intentId: "nearby_shows" } },
      { label: "Offers and discounts", action: { type: "intent", intentId: "offers_discounts" } },
    ],
  },
  offers_discounts: {
    id: "offers_discounts",
    text: "Check active offers on wallet, UPI, and cards during checkout. Apply only one best eligible offer per booking and verify final payable amount before confirming.",
    quickReplies: [
      { label: "Ticket price info", action: { type: "intent", intentId: "ticket_price_info" } },
      { label: "Refund timeline", action: { type: "intent", intentId: "refund_timeline" } },
    ],
  },
  movie_details_help: {
    id: "movie_details_help",
    text: "For each movie, review rating, duration, language, genre, cast, and format before booking. This helps avoid mismatch with your preferred screen experience.",
    quickReplies: [
      { label: "Recommended movies", action: { type: "intent", intentId: "recommended_movies" } },
      { label: "Ticket details", action: { type: "intent", intentId: "ticket_details_help" } },
    ],
  },
  ticket_details_help: {
    id: "ticket_details_help",
    text: "Ticket details include movie, cinema, date, slot, seats, amount, and booking status. Please verify all fields in review before payment confirmation.",
    quickReplies: [
      { label: "Booking status meanings", action: { type: "intent", intentId: "booking_status_meanings" } },
      { label: "Refund timeline", action: { type: "intent", intentId: "refund_timeline" } },
    ],
  },
  sports_unavailable: {
    id: "sports_unavailable",
    text: "Sports booking is currently unavailable in this flow. We are enabling it in phases. Please check back soon from the Sports section for rollout updates.",
    quickReplies: [
      { label: "Show other categories", action: { type: "categories" } },
      { label: "Recommended movies", action: { type: "intent", intentId: "recommended_movies" } },
    ],
  },
  best_showtime_recommendation: {
    id: "best_showtime_recommendation",
    text: "Best slot guidance: weekday matinee for lower prices, early evening for balanced crowd, late night for quieter experience. Pick based on budget and convenience.",
    quickReplies: [
      { label: "Nearby shows", action: { type: "intent", intentId: "nearby_shows" } },
      { label: "Ticket price info", action: { type: "intent", intentId: "ticket_price_info" } },
    ],
  },

  booking_flow: {
    id: "booking_flow",
    text: "Flow: select movie > choose cinema/date/slot > lock seats > pay > verify > booking status updates.",
  },
  show_expiry_logic: {
    id: "show_expiry_logic",
    text: "Seat locks expire after a limited time. If payment is not completed in time, seats are released automatically.",
  },
  booking_status_meanings: {
    id: "booking_status_meanings",
    text: "Pending: initiated. Paid: confirmed. Cancelled: user/system cancelled. Expired: lock/payment window ended.",
  },
  refund_timeline: {
    id: "refund_timeline",
    text: "Refund processing typically takes 3-7 business days, depending on payment partner and bank timelines.",
  },
  reward_system: {
    id: "reward_system",
    text: "Rewards are earned on eligible successful bookings and can be redeemed under defined points/booking rules.",
  },

  fallback: {
    id: "fallback",
    text: "I'm sorry, I didn't understand that. Please choose a support category below.",
    quickReplies: [
      { label: "Support categories", action: { type: "categories" } },
      { label: "Still need help?", action: { type: "escalate" } },
    ],
  },
  escalation: {
    id: "escalation",
    text: "Still need help? Please use Chat with Assistant tab or contact support with your booking/payment reference ID.",
    quickReplies: [
      { label: "Support categories", action: { type: "categories" } },
      { label: "Reset conversation", action: { type: "reset" } },
    ],
  },
};

export const rootNodeId = "welcome";

const feedbackRoute = "/profile/feedback";
const feedbackQuickReply: QuickReply = {
  label: "Share feedback",
  action: { type: "navigate", href: feedbackRoute },
};

const nonResolutionNodeIds = new Set<string>([
  rootNodeId,
  "category_login_auth",
  "category_booking",
  "category_payment_wallet",
  "category_account_settings",
  "category_security",
  "category_app_info",
  "payment_failed_q1",
  "fallback",
  "escalation",
]);

const resolveGreetingByHour = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return { text: "Good morning", emoji: "☀️" };
  }
  if (hour >= 12 && hour < 17) {
    return { text: "Good afternoon", emoji: "🌤️" };
  }
  if (hour >= 17 && hour < 22) {
    return { text: "Good evening", emoji: "🌆" };
  }
  return { text: "Good night", emoji: "🌙" };
};

const getFirstName = (value?: string | null) => {
  if (!value) return "there";
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return "there";
  return normalized.split(" ")[0];
};

export function getWelcomeMessage(userName?: string | null, now = new Date()): string {
  const { text, emoji } = resolveGreetingByHour(now.getHours());
  const firstName = getFirstName(userName);
  return `${text}, ${firstName}! ${emoji} I can help with trending and recommended movies, nearby shows, ticket rates, booking/ticket details, refunds, and account support. Sports booking is currently unavailable, but I can guide you with alternatives.`;
}

export function shouldOfferFeedbackForNode(nodeId: string): boolean {
  return !nonResolutionNodeIds.has(nodeId);
}

export function getNodeText(nodeId: string, options?: { userName?: string | null; now?: Date }): string {
  const node = getNodeById(nodeId);
  if (node.id === rootNodeId) {
    return getWelcomeMessage(options?.userName, options?.now ?? new Date());
  }
  return node.text;
}

export function getNodeQuickReplies(
  nodeId: string,
  options?: { hideBack?: boolean; includeFeedback?: boolean },
): QuickReply[] {
  const node = getNodeById(nodeId);
  let quickReplies = node.quickReplies ? [...node.quickReplies] : [];

  if (options?.hideBack !== false) {
    quickReplies = quickReplies.filter((reply) => reply.action.type !== "back");
  }

  if (options?.includeFeedback && shouldOfferFeedbackForNode(node.id)) {
    const hasFeedbackChip = quickReplies.some(
      (reply) => reply.action.type === "navigate" && reply.action.href === feedbackRoute,
    );

    if (!hasFeedbackChip) {
      quickReplies = [...quickReplies, feedbackQuickReply];
    }
  }

  return quickReplies;
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

export function detectIntentFromText(input: string): RuleIntent | null {
  const text = normalize(input);
  if (!text) return null;
  const paddedText = ` ${text} `;

  let bestMatch: RuleIntent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) continue;
      if (paddedText.includes(` ${normalizedKeyword} `)) {
        score += normalizedKeyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

export function getNodeById(nodeId: string): DecisionNode {
  return nodes[nodeId] || nodes.fallback;
}

export function getRootQuickReplies(): QuickReply[] {
  return getNodeQuickReplies(rootNodeId, { hideBack: true, includeFeedback: false });
}

export function resolveQuickReplyFromText(nodeId: string, input: string): QuickReply | null {
  const node = getNodeById(nodeId);
  if (!node.quickReplies?.length) return null;
  const normalized = normalize(input);
  return (
    node.quickReplies.find((item) => normalize(item.label) === normalized) ||
    node.quickReplies.find((item) => normalized.includes(normalize(item.label))) ||
    null
  );
}
