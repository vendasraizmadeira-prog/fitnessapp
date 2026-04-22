export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-black tracking-tight">
            FIT<span className="text-red-600">PRO</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
