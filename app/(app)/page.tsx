"use client";

import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { HomeMessages } from "@/data/messageData";
import { features } from "@/data/Features";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MessageCircleMore } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-between flex-grow min-h-[90vh]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow px-4 py-10 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#1e293b] text-slate-100">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          Dive into the World of the Unknown
        </h1>
        <p className="text-slate-300 mt-4 text-center max-w-xl">
          Ghost Whisper – Where your voice is heard, but your identity remains a
          mystery.
        </p>

        {/* Message Carousel */}
        <div className="mt-10 w-full max-w-2xl">
          <Carousel plugins={[Autoplay({ delay: 2500 })]}>
            <CarouselContent>
              {HomeMessages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-[#2e2b58] border border-purple-500/30 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="flex gap-4 items-start px-5 py-4 text-slate-100">
                      <MessageCircleMore className="text-yellow-400 w-5 h-5 mt-1 -scale-x-100" />
                      <div>
                        <p className="text-slate-100">{message.content}</p>
                        <p className="text-xs text-purple-300 mt-1">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-[#1e1b4b] rounded-lg border border-indigo-600 shadow"
            >
              {feature.icon}
              <span className="text-white text-lg font-medium">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-500 text-center py-4 border-t border-indigo-900">
        © 2025 Ghost Whisper. All rights reserved.
      </footer>
    </div>
  );
}
