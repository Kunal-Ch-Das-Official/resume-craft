import "./globals.css";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ResumeCraft — Build a Premium Resume in Minutes",
  description:
    "Professional, ATS-optimized resume templates with a live editor. Design, write, and export in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
