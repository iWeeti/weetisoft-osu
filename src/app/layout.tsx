import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";
import { Providers } from "./providers";

import "~/styles/globals.css";
import { BaseLayout } from "~/components/layouts/base";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin-ext"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Auto Host Rotate",
  description: "osu! Auto Host Rotation multiplayer lobbies.",
  icons: ["/AHR.png"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className={cn(inter.className)}>
              <BaseLayout>
                <>{children}</>
              </BaseLayout>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
