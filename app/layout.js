import "./globals.css";

export const metadata = {
  title: "Wishlist-iT",
  description: "For easy gifting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
