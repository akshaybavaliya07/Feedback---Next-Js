import { ShieldCheck, Mic } from "lucide-react";
import type { ReactNode } from "react";

type FeatureItem = {
  icon: ReactNode;
  label: string;
};

export const features: FeatureItem[] = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
    label: "100% Anonymous",
  },
  {
    icon: <Mic className="w-6 h-6 text-blue-400" />,
    label: "Speak Freely",
  }
];
