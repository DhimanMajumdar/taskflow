import { Geist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Team Task Manager",
  description: "Production-ready task management system with role-based access control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} min-h-full bg-gray-50`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
