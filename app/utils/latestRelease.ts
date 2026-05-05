type FeatureStatus = "live" | "released" | "upcoming" | "planned" | '';

type Feature = {
    title: string;
    status: FeatureStatus;
};

export type SectionVariant = "live" | "upcoming" | "planned" | "default";

export type Release = {
    version: string;
    releaseDate: string;
    status: "latest" | "previous" | "upcoming" | "planned";
    features: Feature[];
};

export const releases: Release[] = [
    {
        version: "1.2.0",
        releaseDate: "May 2026",
        status: "latest",
        features: [
            { title: "Favorites", status: "live" },
            { title: "Coupon", status: "live" }, 
            { title: "Offers and Deals", status: "live" },
            { title: "Cancelled Bookings", status: "live" },
            { title: "User Feedback", status: "live" },
            { title: "UI Improvements", status: "live" },
            { title: "Bug Fixes", status: "live" },
        ],
    },
    {
        version: "1.3.0",
        releaseDate: "June 2026",
        status: "upcoming",
        features: [
            { title: "Refunded Bookings", status: "upcoming" },
            { title: "Subscription", status: "upcoming" },
            { title: "Notifications", status: "upcoming" },
            { title: "Testimonials", status: "upcoming" },
            { title: "User Reviews and Ratings", status: "upcoming" },
            { title: "Admin Dashboard", status: "upcoming" },
            { title: "Invite and Share", status: "upcoming" },
        ],
    },
    {
        version: "1.4.0",
        releaseDate: "TBD",
        status: "planned",
        features: [
            { title: "Hotel Booking", status: "planned" },
            { title: "Flight Booking", status: "planned" },
            { title: "Train Booking", status: "planned" },
            { title: "Auto Top-up", status: "planned" },
            { title: "Best Seat by Preference", status: "planned" },
            { title: "Payment Preferences", status: "planned" },
            { title: "Billing Preferences", status: "planned" },
            { title: "User Activity Log", status: "planned" },
        ],
    },
    {
        version: "1.1.0",
        releaseDate: "April 2026",
        status: "previous",
        features: [
            { title: "AI Chatbot", status: "released" },
            { title: "Chat with Assistant", status: "released" },
            { title: "Payments", status: "released" },
            { title: "Security", status: "released" },
            { title: "Seat Booking", status: "released" },
            { title: "Wallet System", status: "released" },
        ],
    },
    {
        version: "1.0.0",
        releaseDate: "February 2026",
        status: "previous",
        features: [
            { title: "Concerts Booking", status: "released" },
            { title: "Gaming Booking", status: "released" },
            { title: "Sports Booking", status: "released" },
            { title: "Event Booking", status: "released" }
        ],
    },
];
