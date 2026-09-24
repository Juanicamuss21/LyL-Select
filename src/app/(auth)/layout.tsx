export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 flex flex-col justify-center">
      {children}
    </div>
  )
}
