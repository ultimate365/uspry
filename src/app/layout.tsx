import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { GlobalContextProvider } from "../context/Store";
import BootstrapClient from "../components/BootstrapClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer } from "react-toastify";
import { Tiro_Bangla, Roboto } from "next/font/google";
import localFont from "next/font/local";
const dejaVuBold = localFont({
  src: [
    {
      path: "../../public/assets/fonts/DejaVuSerifCondensed-Bold.ttf",
    },
  ],
  variable: "--font-dejaVuBold",
});
const dejaVuCondensed = localFont({
  src: [
    {
      path: "../../public/assets/fonts/DejaVuSerifCondensed.ttf",
    },
  ],
  variable: "--font-dejaVuCondensed",
});
const tiro_bangla = Tiro_Bangla({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-tiro",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "UTTAR SEHAGORI PRIMARY SCHOOL",
  description: "Welcome to UTTAR SEHAGORI PRIMARY SCHOOL's Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`container-fluid text-center text-black ${tiro_bangla.variable} ${roboto.variable} ${dejaVuBold.variable} ${dejaVuCondensed.variable}`}
        suppressHydrationWarning={true}
      >
        <GlobalContextProvider>
          <Navbar />
          <div className="my-2">
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="light"
            />
            {children}
          </div>
          <Footer />
          <BootstrapClient />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
