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
        status: "previous",
        features: [
            { title: "Favorites", status: "released" },
            { title: "Coupon", status: "released" },
            { title: "Offers and Deals", status: "released" },
            { title: "Cancelled Bookings", status: "released" },
            { title: "User Feedback", status: "released" },
            { title: "Refunded Bookings", status: "released" },
            { title: "Subscription", status: "released" },
            { title: "Notifications", status: "released" },
            { title: "Testimonials", status: "released" },
            { title: "User Reviews and Ratings", status: "released" },
            { title: "Seat Preference", status: "released" },
            { title: "Payment Preferences", status: "released" },
            { title: "Faster Booking Flow", status: "released" },
            { title: "Invite and Share", status: "released" },
            { title: "UI Improvements", status: "released" },
            { title: "Bug Fixes", status: "released" },
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
    {
        version: "1.3.0",
        releaseDate: "Oct 2026",
        status: "latest",
        features: [
            { title: "Train Booking", status: "live" },
            { title: "AI Assistant (Movie)", status: "live" },
            { title: "Admin Dashboard", status: "live" },
            { title: "UI Update", status: "live" },
            { title: "Added more bugs", status: "live" },
        ],
    },
    {
        version: "1.4.0",
        releaseDate: "TBD",
        status: "planned",
        features: [
            { title: "Auto Top-up", status: "planned" },
            { title: "User Activity Log", status: "planned" }
        ],
    }
];
