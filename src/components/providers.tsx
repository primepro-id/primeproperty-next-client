"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { TanstackProviders } from "@/components/custom-ui";

type TProviders = {
  children: React.ReactNode;
};

const Providers = ({ children }: TProviders) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TanstackProviders>{children}</TanstackProviders>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
};

export default Providers;
