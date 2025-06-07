import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export default function NonSidebarBranding() {
  const { open, isMobile } = useSidebar();
  return (
    <div className="flex items-center w-full py-2 bg-sidebar">
      <SidebarTrigger className="bg-transparent" />
      {(!open || isMobile) && (
        <div className="flex items-center justify-start">
          <Image src="/favicon.ico" alt="ChessMate" width={50} height={50} />
          <h1 className="sigmar-text mr-auto text-2xl">ChessMate</h1>
        </div>
      )}
    </div>
  );
}
