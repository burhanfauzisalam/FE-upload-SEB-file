// app/layout.js atau app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import MyNavbar from "../components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MyNavbar />
        {children}
      </body>
    </html>
  );
}
