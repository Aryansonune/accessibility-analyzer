export default function Hero() {
  return (
    <header className="pt-12 pb-8 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center px-6">
        <div className="mb-6">
          <span className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2l2.7 5.5L20 9l-4 3.2L17 18l-5-2.8L7 18l1-5.8L4 9l5.3-1.5L12 2z" fill="#2F6BFF" opacity="0.15"/>
              <path d="M12 2l2.7 5.5L20 9l-4 3.2L17 18l-5-2.8L7 18l1-5.8L4 9l5.3-1.5L12 2z" stroke="#2F6BFF" strokeWidth="0.6" fill="none"/>
            </svg>
            WCAG Accessibility Checker
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="text-slate-900">A11y</span>{" "}
          <span className="text-a11yBlue">Analyzer</span>
        </h1>

        <p className="mt-4 max-w-3xl mx-auto text-slate-500">
          Paste a URL or upload an HTML file to check for accessibility issues
          against WCAG guidelines.
        </p>
      </div>
    </header>
  );
}