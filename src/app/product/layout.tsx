export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-green-600 p-3">
        <div className="flex justify-between">
          <div>Navbar</div>
          <div className=""></div>
        </div>
      </nav>
      {children}
    </div>
  );
}
