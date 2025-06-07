"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HelpCircle,
  LogOut,
  MessageCircle,
  Settings,
  User,
  LogIn,
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/lib/auth/authService";
import { useAuth } from "@/lib/auth/authContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// Menu items.
const items = [
  {
    title: "Play",
    url: "/",
    icon: "/icons/play.webp",
  },
  {
    title: "Puzzles",
    url: "/puzzles",
    icon: "/icons/puzzle.webp",
  },
  {
    title: "Learn",
    url: "/learn",
    icon: "/icons/learn.webp",
  },
  {
    title: "Watch",
    url: "/watch",
    icon: "/icons/watch.webp",
  },
  {
    title: "News",
    url: "/news",
    icon: "/icons/newspaper.webp",
  },
];

const supportItems = [
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const userItems = [
    {
      title: "Profile",
      function: () => router.push("/profile"),
      icon: User,
    },
    {
      title: "Settings",
      function: () => router.push("/settings"),
      icon: Settings,
    },
    {
      title: "Sign Out",
      function: () => {
        setShowLogoutDialog(true);
      },
      icon: LogOut,
    },
  ];

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
  };
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem
              className="flex items-center space-x-2 pt-2 hover:cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src="/favicon.ico"
                alt="ChessMate"
                width={50}
                height={50}
              />
              <h1 className="sigmar-text mr-auto text-2xl">ChessMate</h1>
              <SidebarTrigger className="md:hidden" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Main Menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Game</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={25}
                          height={25}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Support */}
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* User Menu */}
          {user ? (
            <SidebarGroup>
              <SidebarGroupLabel>User ({user.email})</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.function} asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-3 mb-2"
                        onClick={() => router.push("/login")}
                      >
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        className="w-full gap-3 hover:bg-white/80 hover:text-black"
                        onClick={() => router.push("/login?tab=signup")}
                      >
                        <User className="w-5 h-5" />
                        Create Account
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          <div className="flex-grow" />
          {/* Footer */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/developer"
                      className="relative flex items-center gap-3 h-fit p-[2px] rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-border overflow-hidden"
                    >
                      <div className="flex items-center gap-3 bg-white dark:bg-black rounded-md px-2 py-1 w-full">
                        <Image
                          src="/developer.webp"
                          alt="dev"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <span>Developer Info</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
