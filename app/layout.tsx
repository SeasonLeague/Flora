import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // Import Link for navigation
import "./globals.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FloraFusion",
  description: "Get accurate plant knowledge Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar */}
        <nav className="bg-green-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <Link href="/" className="text-xl font-bold mb-2 sm:mb-0">FPC</Link>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-green-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-green-200">About</Link></li>
              <li><Link href="/contact" className="hover:text-green-200">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-green-200">FAQ</Link></li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-green-800 text-white p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p>We're passionate about helping people identify and care for plants. Our AI-powered tool makes plant identification easy and accessible.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-green-200 transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-green-200 transition-colors duration-300">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-green-200 transition-colors duration-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <p className="mb-4">Follow us on social media for plant care tips and updates:</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://github.com/SeasonLeague" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaGithub className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center">
            <p>&copy; 2024 FloraFusion Plant Classifier (FPC). All rights reserved.</p>
            <p className="mt-2">With love built by Ihechibest</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
