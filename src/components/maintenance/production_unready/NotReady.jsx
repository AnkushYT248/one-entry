'use client';

import { useEffect, useState } from "react";

const NotReady = () => {
  const calculateTimeLeft = () => {
    const target = new Date("2025-08-30T00:00:00");
    const difference = +target - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-accent-foreground text-accent">
    <h1 className="text-4xl font-bold mb-4">🚧 Under Construction</h1>
    <p className="text-gray-600 mb-8">Our site is getting a fresh upgrade. Stay tuned!</p>

    <div className="flex gap-6 text-center text-xl font-medium">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-gray-100 dark:bg-zinc-800 px-6 py-4 rounded-xl shadow text-black dark:text-white">
          <div className="text-3xl font-bold">{value}</div>
          <div>{label}</div>
        </div>
      ))}
    </div>

    <p className="mt-10 text-sm text-gray-500">We'll be live soon — thank you for your patience.</p>
  </div>

  );
};

export default NotReady;
