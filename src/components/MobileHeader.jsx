import { Menu } from "lucide-react";

export function MobileHeader({ onMenuClick }) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 z-30 flex items-center px-4 justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2.5 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-gray-700 text-lg">Desk kit</span>
      </div>

      <div className="w-11 h-11 rounded-xl ">
        <img
          src="/logo3.png"
          alt="Desk kit"
          className="object-contain rounded-xl"
        />
      </div>
    </header>
  );
}

export default MobileHeader;
