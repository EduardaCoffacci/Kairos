"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/hero/Hero";
import Header from "../components/header/Header";
import DryingImportance from "@/components/drying-importance/DryingImportance";
import DryingChallenges from "@/components/drying-challenges/DryingChallenges";
import ChipBurners from "@/components/chip-burners/ChipBurners";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let timeout: ReturnType<typeof setTimeout>;

    const alternarVelocidade = () => {
      // Bem lento
      video.playbackRate = 0.2;

      timeout = setTimeout(() => {
        // Velocidade normal
        video.playbackRate = 1;

        timeout = setTimeout(() => {
          // Bem rápido
          video.playbackRate = 2;

          timeout = setTimeout(alternarVelocidade, 2000);
        }, 2000);
      }, 5000);
    };

    alternarVelocidade();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#100606] text-white">
      {/* Vídeo de fundo */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-auto w-full object-contain"
        >
          <source src="/17923125-hd_1920_1080_60fps.mp4" type="video/mp4" />
        </video>

        {/* Camada escura */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <DryingImportance />
        <DryingChallenges />
        <ChipBurners />

        <Footer />
      </div>
    </main>
  );
}
