"use client";

export default function ZoomActionButton({
  label,
  onClick,
  hasDropdown = false,
  children,
  buttonClassName = "bg-blue-600",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center text-center focus:outline-none"
      aria-label={label}
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md transition-colors group-hover:bg-blue-700 group-focus:ring-2 group-focus:ring-blue-500 group-focus:ring-offset-2 ${buttonClassName}`}
      >
        {children}

        {hasDropdown && (
          <span className="absolute bottom-2 right-2 text-white" aria-hidden="true">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </span>
        )}
      </span>

      <span className="mt-2 text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}
