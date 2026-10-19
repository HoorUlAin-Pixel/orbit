"use client";
import { useEffect, useState } from "react";

const KEY = "orbit-splash";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {}
    if (seen) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden"; // no scrolling behind the splash
    const fade = setTimeout(() => setFading(true), 1700);
    const hide = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }, 2200);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`splash-root fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#6a5ef0] text-white transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex size-40 items-center justify-center">
        <div className="splash-orbit absolute inset-0">
          <span className="absolute left-1/2 top-0 size-4 -translate-x-1/2 rounded-full bg-amber-300 shadow-md" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/192"
          alt=""
          className="splash-pop size-24 rounded-3xl shadow-lg"
        />
      </div>
      <h1 className="splash-rise text-3xl font-bold" style={{ animationDelay: "0.3s" }}>
        Orbit
      </h1>
      <p className="splash-rise text-sm opacity-90" style={{ animationDelay: "0.5s" }}>
        Rotate. Share. Done.
      </p>
    </div>
  );
}