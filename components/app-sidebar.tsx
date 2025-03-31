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
} from "@/components/ui/sidebar"
import { HelpCircle, LogOut, MessageCircle, Settings, User, LogIn } from "lucide-react"
import Image from "next/image"
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
} from "@/components/ui/alert-dialog"
import { useState } from "react";
// Menu items.
const items = [
    {
        title: "Play",
        url: "/play",
        icon: '/icons/play.webp',
    },
    {
        title: "Puzzles",
        url: "#",
        icon: '/icons/puzzle.webp',
    },
    {
        title: "Learn",
        url: "#",
        icon: '/icons/learn.webp',
    },
    {
        title: "Watch",
        url: "#",
        icon: '/icons/watch.webp',
    },
    {
        title: "News",
        url: "#",
        icon: '/icons/newspaper.webp',
    },
]

const supportItems = [
    {
        title: "Help",
        url: "#",
        icon: HelpCircle,
    },
    {
        title: "Feedback",
        url: "/feedback",
        icon: MessageCircle,
    },
]

const userItems = [
    {
        title: "Profile",
        function: () => { },
        icon: User,
    },
    {
        title: "Settings",
        function: () => { },
        icon: Settings,
    },
    {
        title: "Sign Out",
        icon: LogOut,
    },
]

export function AppSidebar() {
    const { user } = useAuth();
    const router = useRouter();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = async () => {
        setShowLogoutDialog(false);
        await logout();
    };
    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center space-x-2 pt-2">
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

                    {user ? (
                        <SidebarGroup>
                            <SidebarGroupLabel>User</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {userItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                onClick={item.title === "Sign Out"
                                                    ? () => setShowLogoutDialog(true)
                                                    : item.function}
                                                className="flex items-center gap-3"
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.title}</span>
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
                                                onClick={() => router.push('/login')}
                                            >
                                                <LogIn className="w-5 h-5" />
                                                Sign In
                                            </Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Button
                                                className="w-full gap-3"
                                                onClick={() => router.push('/login?tab=signup')}
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
                </SidebarContent>
            </Sidebar>
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
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
    )
}