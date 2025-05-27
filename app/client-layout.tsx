"use client";

import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/authContext";
import { Toaster } from "@/components/ui/sonner";
import NonSidebarBranding from "@/components/non-sidebar-branding";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col w-full">
            <NonSidebarBranding />
            {children}
          </div>
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}
