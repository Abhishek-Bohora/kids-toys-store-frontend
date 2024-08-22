export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>
          <nav className="bg-green-500 p-3">Navbar</nav>
          {children}
        </main>
      </body>
    </html>
  );
}
