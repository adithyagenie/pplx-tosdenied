"use client";
import { useEffect, useState } from "react";

interface RotatingTextProps {
  texts: string[];
  /** Time each text is displayed, in milliseconds */
  interval?: number;
  /** Duration of fade in/out, in milliseconds */
  fadeDuration?: number;
}

export function RotatingText({
  texts,
  interval = 5000,
  fadeDuration = 500,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ticker = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setVisible(true);
      }, fadeDuration);
    }, interval);
    return () => {
      clearInterval(ticker);
    };
  }, [texts.length, interval, fadeDuration]);

  return (
    <span
      className={`inline-block transition-opacity ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDuration: `${fadeDuration}ms` }}
    >
      {texts[index]}
    </span>
  );
}
