import Lottie from "lottie-react";
import loaderAnimation from "@/public/json/loader.json";
import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen duration-300 w-full">
            <Lottie animationData={loaderAnimation} loop={true} className="w-56 dark:invert dark:brightness-150" />

            <motion.p
                className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
            >
                <motion.span
                    className="relative"
                    animate={{
                        textShadow: [
                            "0px 0px 0px rgba(255,255,255,0)",
                            "2px 2px 8px rgba(255,255,255,0.8)",
                            "0px 0px 0px rgba(255,255,255,0)"
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    Hang tight, we&apos;re loading the page
                </motion.span>
            </motion.p>
        </div>
    );
}