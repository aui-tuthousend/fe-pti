import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/Loading'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export const Route = createFileRoute('/auth/Login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
        // Handle successful login logic here
      console.log('Login:', { email, password })
    }, 2000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-background flex-col items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/user/arimbilogo.png" 
              alt="ArimbiStore Logo" 
              className="w-32 h-32 mx-auto mb-6"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            ArimbiStore
          </h1>
        </div>
      </div>

      {/* Right Section - Login Form with Background */}
      <div 
        className="w-full lg:w-1/2 relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('/user/bgauth.jpg')`
        }}
      >
        {/* Login Form Overlay */}
        <div className="w-full max-w-md p-8 bg-card/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary mx-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <img 
              src="/user/arimbilogo.png" 
              alt="ArimbiStore Logo" 
              className="w-16 h-16 mx-auto mb-3"
            />
            <h1 className="text-xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              ArimbiStore
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-accent mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-accent">
              Silakan masuk ke akun Anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium  text-accent">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium  text-accent">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-primary rounded-lg pl-10 pr-12 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Masukkan password Anda"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-sm  text-accent">Ingat saya</span>
              </label>
              <Link
                to="/"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="text-primary-foreground" />
                  OTW masuk...
                </>
              ) : (
                <>
                  Masuk
                </>
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className=" text-accent">
                Belum punya akun?{' '}
                <Link
                  to="/auth/Register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
