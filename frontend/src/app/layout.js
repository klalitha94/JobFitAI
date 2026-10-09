import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "JobFit AI - Smart Job Recommendation & AI Interview Prep",
  description: "Modern AI-powered fresher and internship job matching platform powered by Gemini AI. Real openings across Bengaluru, tech hubs, and remote positions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
