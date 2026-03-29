import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AlertContainer } from "@/components/organisms/AlertContainer";
import { ModalContainer } from "@/components/organisms/ModalContainer";


const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Speed Delivery",
  description: "",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="winter" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <AlertContainer />
        <ModalContainer />
        {/* <FloatingChat /> */}
      </body>
    </html>
  );
}
