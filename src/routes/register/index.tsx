import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { registerFn } from './-server'

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '', password: '' }
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi'
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi'
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi'
    if (!formData.password) newErrors.password = 'Password wajib diisi'
    else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter'
    setErrors(newErrors)
    return !newErrors.name && !newErrors.email && !newErrors.phone && !newErrors.password
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        username: formData.name, // Use name as username
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      }
      await registerFn({ data: payload })
      toast.success('Pendaftaran berhasil!')
      navigate({ to: '/login' })
    } catch (error: any) {
      toast.error(error?.message || 'Pendaftaran gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Register Form with Background */}
      <div
        className="w-full lg:w-1/2 relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('/user/bgauth.jpg')`
        }}
      >
        {/* Register Form Overlay */}
        <div className="w-full max-w-md p-6 bg-card/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary mx-6 my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4">
            <img
              src="/user/arimbilogo.png"
              alt="ArimbiStore Logo"
              className="w-12 h-12 mx-auto mb-2"
            />
            <h1 className="text-lg font-bold text-primary" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              ArimbiStore
            </h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-accent mb-1">
              Daftar Akun Baru
            </h2>
            <p className="text-accent text-sm">
              Bergabunglah dengan ArimbiStore
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium text-accent">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="fullName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full bg-background border rounded-lg pl-10 pr-4 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.name ? 'border-red-500' : 'border-primary'
                    }`}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-accent">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full bg-background border rounded-lg pl-10 pr-4 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.email ? 'border-red-500' : 'border-primary'
                    }`}
                  placeholder="Masukkan email Anda"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-accent">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`w-full bg-background border rounded-lg pl-10 pr-4 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.phone ? 'border-red-500' : 'border-primary'
                    }`}
                  placeholder="Masukkan nomor telepon"
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-accent">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`w-full bg-background border rounded-lg pl-10 pr-12 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.password ? 'border-red-500' : 'border-primary'
                    }`}
                  placeholder="Buat password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            {/* <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-accent">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-background border border-primary rounded-lg pl-10 pr-12 py-3 text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Konfirmasi password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div> */}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-accent">
                Saya setuju dengan{' '}
                <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  syarat dan ketentuan
                </Link>{' '}
                yang berlaku
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:shadow-lg"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-accent">
                Sudah punya akun?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Logo */}
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
    </div>
  )
}
