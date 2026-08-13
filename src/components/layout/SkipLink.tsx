export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white opacity-0 transition-[transform,opacity] duration-150 focus:translate-y-0 focus:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      İçeriğe geç
    </a>
  );
}
