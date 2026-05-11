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
            { title: "Refunded Bookings", status: "live" },
            { title: "Subscription", status: "live" },
            { title: "Notifications", status: "live" },
            { title: "Testimonials", status: "live" },
            { title: "User Reviews and Ratings", status: "live" },
            { title: "Seat Preference", status: "live" },
            { title: "Payment Preferences", status: "live" },
            { title: "Faster Booking Flow", status: "live" },
            { title: "Invite and Share", status: "live" },
            { title: "UI Improvements", status: "live" },
            { title: "Bug Fixes", status: "live" },
        ],
    },
    {
        version: "1.3.0",
        releaseDate: "TBD",
        status: "planned",
        features: [
            { title: "Hotel Booking", status: "planned" },
            { title: "Flight Booking", status: "planned" },
            { title: "Train Booking", status: "planned" },
            { title: "Auto Top-up", status: "planned" },
            { title: "User Activity Log", status: "planned" },
            { title: "Admin Dashboard", status: "planned" },
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
