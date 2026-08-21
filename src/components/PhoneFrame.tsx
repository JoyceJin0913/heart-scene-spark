import { useEffect, useState } from "react";

/**
 * Wraps the app in a phone mockup on large screens.
 * On small screens the app renders full-bleed as usual.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return <>{children}</>;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)] p-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative">
        {/* device frame */}
        <div className="relative rounded-[3.2rem] bg-[#0b0709] p-[12px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="pointer-events-none absolute inset-0 rounded-[3.2rem] ring-1 ring-inset ring-white/10" />
          {/* screen */}
          <div
            className="relative h-[844px] w-[390px] overflow-hidden rounded-[2.6rem] bg-background"
            style={{ transform: "translateZ(0)" }}
          >
            {/* dynamic island */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-[999] h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
            <div className="h-full w-full overflow-y-auto overscroll-contain">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
