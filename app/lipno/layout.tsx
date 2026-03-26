import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lipno. Sport & resort",
  description: "Mobilní koncept aplikace pro rodinný areál a sportovní středisko Lipno.",
};

export default function LipnoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
