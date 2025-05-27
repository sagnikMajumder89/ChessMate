import { Metadata } from "next";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "ChessMate",
  description:
    "Play chess with your friends online for free or against the computer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
