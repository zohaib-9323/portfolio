export default function Footer() {
  return (
    <footer className="wrap pb-28 md:pb-10">
      <div className="flex flex-col gap-4 border-t-[1.5px] border-ink pt-6 text-[0.85rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Zohaib Asghar. Built with Next.js, set in Archivo &amp; Geist.</p>
        <a href="#top" className="link w-fit">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
