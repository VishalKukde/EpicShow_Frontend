import MobileProfileMenuPanel from "../components/MobileProfileMenuPanel";

export default function ProfileMenuPage() {
  return (
    <>
      <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white p-6 text-gray-700">
        Mobile profile menu is available on mobile view only.
      </div>
      <MobileProfileMenuPanel />
    </>
  );
}
