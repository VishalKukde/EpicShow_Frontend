const ProfileStatCard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Bookings" value="24" />
            <StatCard title="Active Tickets" value="3" />
            <StatCard title="Wallet Balance" value="₹4,200" />
            <StatCard title="Rewards Points" value="1,250" />
        </div>
    )
}

export default ProfileStatCard


/* STAT CARD */
type StatCardProps = {
    title: string;
    value: string;
};

function StatCard({ title, value }: StatCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
