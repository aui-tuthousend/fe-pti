import { useState } from 'react'
import { Mail, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Newsletter() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            // TODO: Integrate with newsletter service
            console.log('Newsletter subscription:', email)
            setIsSubmitted(true)
            setTimeout(() => {
                setEmail('')
                setIsSubmitted(false)
            }, 3000)
        }
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-primary/20 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12" />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                Dapatkan Penawaran Eksklusif
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Berlangganan newsletter kami dan dapatkan diskon spesial, info produk terbaru, dan tips fashion hijab langsung ke email Anda!
                            </p>
                        </div>

                        {/* Form */}
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Masukkan email Anda"
                                            required
                                            className="w-full bg-background border-2 border-primary/30 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                                    >
                                        <Send size={18} />
                                        <span className="hidden sm:inline">Berlangganan</span>
                                        <span className="sm:hidden">Subscribe</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Kami menghargai privasi Anda. Unsubscribe kapan saja.
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-lg">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Terima kasih! Anda telah berlangganan newsletter kami.</span>
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <span className="text-primary font-bold">10%</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Diskon untuk pelanggan baru</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">Akses produk eksklusif</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground">Tips fashion hijab mingguan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
