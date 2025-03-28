"use client";
import { useEffect, useState } from "react";
import { login, signUp, signInWithGoogle } from "@/lib/auth/authService";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/authContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const { user } = useAuth();
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (activeTab === "login") {
                await login(email, password);
                toast.success("Welcome back!");
            } else {
                await signUp(email, password);
                toast.success("Account created!");
            }
        } catch {
            toast.error(
                activeTab === "login"
                    ? "Login failed. Please check your credentials."
                    : "Sign up failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            toast.success("Logged in successfully");
        } catch {
            toast.error("Google login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            console.log("User is logged in, redirecting to home page");
            router.push("/");
        }
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab") as "login" | "signup" | null;
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab("login");
        }
    }, [router, user]);


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {activeTab === "login" ? "Welcome back" : "Create account"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {activeTab === "login"
                            ? "Enter your credentials to sign in"
                            : "Get started with your new account"}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant={activeTab === "login" ? "outline" : "link"}
                        className="flex-1"
                        onClick={() => setActiveTab("login")}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant={activeTab === "signup" ? "outline" : "link"}
                        className="flex-1"
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign Up
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {activeTab === "login" ? "Sign In" : "Sign Up"}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    <Image
                        src="/icons/google.png"
                        alt="Google"
                        width={16}
                        height={16}
                        className="mr-2"
                    />
                    Google
                </Button>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    {activeTab === "login" ? (
                        <>Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setActiveTab("signup")}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setActiveTab("login")}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>

                <div className="text-center text-sm text-muted-foreground">
                    <p>By continuing, you agree to our</p>
                    <p>
                        <button className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </button>{" "}
                        and{" "}
                        <button className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}