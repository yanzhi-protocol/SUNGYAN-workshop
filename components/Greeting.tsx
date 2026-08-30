"use client";

import { useEffect, useState } from "react";
import BilingualText from "./BilingualText";
import { UI } from "@/lib/i18n";

type TimePeriod = "morning" | "afternoon" | "evening" | "night";

export default function Greeting() {
  const [period, setTimePeriod] = useState<TimePeriod>("afternoon");

  useEffect(() => {
    const updatePeriod = () => {
      const hour = new Date().getHours();
      let p: TimePeriod = "afternoon";
      if (hour >= 5 && hour < 12) p = "morning";
      else if (hour >= 12 && hour < 18) p = "afternoon";
      else if (hour >= 18 && hour < 24) p = "evening";
      else p = "night";

      setTimePeriod(p);
      document.documentElement.setAttribute("data-time", p);
    };

    updatePeriod();
    const timer = setInterval(updatePeriod, 60000);
    return () => {
      clearInterval(timer);
      document.documentElement.removeAttribute("data-time");
    };
  }, []);

  const greetingValue = UI.home.greetings[period];

  return (
    <div className="greeting-box">
      <BilingualText
        as="div"
        className="greeting-content"
        value={greetingValue}
      />
    </div>
  );
}
