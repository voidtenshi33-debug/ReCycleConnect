export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-[calc(100vh-theme(spacing.14))] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 -m-4 lg:-m-6">
      {children}
    </div>
  );
}
