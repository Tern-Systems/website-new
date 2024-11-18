
import "./globals.css";
import {Suspense} from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
