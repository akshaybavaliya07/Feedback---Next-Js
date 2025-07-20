"use client";

import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { HomeMessages } from "@/data/MessageData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MessageCircleMore } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-between flex-grow">
      <section className="flex flex-col items-center justify-center flex-grow px-4 py-10 bg-[#1e293b]">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
          Dive into the World of the Unknown
        </h1>
        <p className="text-gray-300 mt-4 text-center max-w-xl">
          Ghost Whisper – Where your voice is heard, but your identity remains a mystery.
        </p>

        <div className="mt-10 w-full max-w-2xl">
          <Carousel plugins={[Autoplay({ delay: 2500 })]}>
            <CarouselContent>
              {HomeMessages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-[#334155] border border-gray-600 shadow-md rounded-xl">
                    <CardContent className="flex gap-4 items-start p-6">
                      <MessageCircleMore className="text-indigo-400 w-5 h-5 mt-1" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{message.received}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <footer className="bg-[#0f172a] text-gray-500 text-center py-4 border-t border-gray-800">
        © 2025 Ghost Whisper. All rights reserved.
      </footer>
    </div>
  );
}
