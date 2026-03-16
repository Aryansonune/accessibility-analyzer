export default function Footer(){
  return (
    <footer className="bg-transparent py-10">
      <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
        Accessibility Analyzer © {new Date().getFullYear()} — built with React + FastAPI
      </div>
    </footer>
  );
}