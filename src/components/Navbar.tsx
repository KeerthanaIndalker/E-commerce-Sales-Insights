interface Props {
  current: "home" | "how";
  onNavigate: (page: "home" | "how") => void;
  showUploadNew?: boolean;
  onUploadNew?: () => void;
}

export function Navbar({ current, onNavigate, showUploadNew, onUploadNew }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-navy text-navy-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-hero shadow-glow">
            <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 6-6" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">SalesIQ</span>
        </button>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink active={current === "home"} onClick={() => onNavigate("home")}>Home</NavLink>
          <NavLink active={current === "how"} onClick={() => onNavigate("how")}>How It Works</NavLink>
          {showUploadNew && (
            <button
              onClick={onUploadNew}
              className="ml-2 rounded-md gradient-hero px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-smooth hover:opacity-90"
            >
              Upload New File
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-smooth ${
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
