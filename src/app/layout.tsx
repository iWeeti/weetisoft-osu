import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";
import { Providers } from "./providers";

import "~/styles/globals.css";
import { BaseLayout } from "~/components/layouts/base";
import { Metadata } from "next";
import { env } from "~/env.mjs";

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
        {env.NEXT_PUBLIC_POSTHOG_TOKEN && (
          <script dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${env.NEXT_PUBLIC_POSTHOG_TOKEN}',{api_host:'https://app.posthog.com'})`
          }}>
          </script>
        )}
      </body>
    </html>
  );
}
