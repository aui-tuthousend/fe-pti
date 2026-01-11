import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
    id: number
    name: string
    role: string
    content: string
    rating: number
    image?: string
}

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Siti Nurhaliza",
            role: "Ibu Rumah Tangga",
            content: "Hijab dari toko ini sangat berkualitas! Bahannya lembut dan nyaman dipakai seharian. Harganya juga terjangkau. Sangat recommended!",
            rating: 5
        },
        {
            id: 2,
            name: "Aisyah Rahman",
            role: "Mahasiswi",
            content: "Koleksinya lengkap dan selalu update model terbaru. Pelayanannya ramah dan pengiriman cepat. Sudah langganan di sini!",
            rating: 5
        },
        {
            id: 3,
            name: "Dewi Lestari",
            role: "Karyawan Swasta",
            content: "Saya suka banget dengan variasi warna dan motifnya. Cocok untuk berbagai acara, dari casual sampai formal. Puas belanja di sini!",
            rating: 5
        },
        {
            id: 4,
            name: "Fatimah Azzahra",
            role: "Pengusaha",
            content: "Kualitas premium dengan harga yang masuk akal. Hijabnya awet dan tidak mudah kusut. Recommended untuk semua muslimah!",
            rating: 5
        }
    ]

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-16 px-4 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-primary mb-4">
                        Testimoni Pelanggan
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Dengarkan pengalaman pelanggan kami yang puas dengan produk hijab berkualitas
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial Card */}
                    <div className="bg-card border border-primary/20 rounded-2xl p-8 md:p-12 shadow-lg">
                        {/* Quote Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Quote className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={24}
                                    className={`${i < currentTestimonial.rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-muted-foreground'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <p className="text-lg text-foreground text-center mb-8 leading-relaxed italic">
                            "{currentTestimonial.content}"
                        </p>

                        {/* Author */}
                        <div className="text-center">
                            <h4 className="font-bold text-primary text-xl mb-1">
                                {currentTestimonial.name}
                            </h4>
                            <p className="text-muted-foreground">
                                {currentTestimonial.role}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={prevTestimonial}
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            onClick={nextTestimonial}
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-primary w-8'
                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
