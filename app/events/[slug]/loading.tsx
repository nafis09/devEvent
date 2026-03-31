export default function Loading() {
  return (
    <section id="event" className="animate-pulse">
      <div className="header">
        <div className="h-7 w-56 rounded bg-white/10" />
        <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/10" />
      </div>

      <div className="details">
        <div className="content">
          <div className="banner h-[360px] w-full rounded bg-white/10" />

          <section className="flex-col-gap-2 mt-6">
            <div className="h-6 w-28 rounded bg-white/10" />
            <div className="h-4 w-full max-w-3xl rounded bg-white/10" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/10" />
          </section>

          <section className="flex-col-gap-2 mt-6">
            <div className="h-6 w-40 rounded bg-white/10" />
            <div className="h-4 w-64 rounded bg-white/10" />
            <div className="h-4 w-52 rounded bg-white/10" />
            <div className="h-4 w-72 rounded bg-white/10" />
          </section>
        </div>

        <aside className="booking">
          <div className="h-6 w-28 rounded bg-white/10" />
          <div className="mt-4 h-10 w-full rounded bg-white/10" />
        </aside>
      </div>
    </section>
  );
}

