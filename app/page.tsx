"use client";

import { useEffect, useRef } from "react";
import Hero from "@/componentes/Hero/Hero";
import Header from "../componentes/Header/Header";
import ImportanciaSecagem from "@/componentes/ImportanciaSecagem/ImportanciaSecagem";
import DesafiosSecagem from "@/componentes/DesafiosSecagem/DesafiosSecagem";
import QueimadoresCavacos from "@/componentes/QueimadoresCavacos/QueimadoresCavacos";
import Footer from "@/componentes/Footer/Footer";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const interval = setInterval(() => {
      // 50% mais lento
      video.playbackRate = 0.2;

      setTimeout(() => {
        // 50% mais rápido
        video.playbackRate = 1;
      }, 3000);
    }, 6000);

    return () => clearInterval(interval);
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
          className=" w-full object-cover object-[50%_65%]"
        >
          <source
            src="/17923125-hd_1920_1080_60fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Camada escura */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <ImportanciaSecagem/>
        <DesafiosSecagem/>
        <QueimadoresCavacos/>
        <Footer/>
      </div>
    </main>
  );
}