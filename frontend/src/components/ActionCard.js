"use client";

export default function ActionCard({ title, iconBgColor, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-44 w-full flex-col items-start justify-between rounded-2xl bg-white p-6 text-left shadow-md shadow-slate-200/70 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-slate-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={title}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ${iconBgColor}`}
      >
        {icon}
      </span>

      <span className="text-xl font-semibold text-slate-950 transition-colors group-hover:text-blue-700">
        {title}
      </span>
    </button>
  );
}
