export const metadata = { title: "Reverta" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          background: "#0b0c0e",
          color: "#e6e9ef",
          margin: 0,
          padding: 24,
        }}
      >
        {children}
      </body>
    </html>
  );
}
