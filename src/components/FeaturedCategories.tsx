import { Link } from '@tanstack/react-router'
import { Package, Sparkles, Heart, Star } from 'lucide-react'

export function FeaturedCategories() {
    const categories = [
        {
            id: 1,
            name: 'Segi Empat',
            description: 'Hijab segi empat premium dengan berbagai pilihan warna',
            icon: Package,
            image: '/user/modelhijab.jpg',
            color: 'from-pink-500/20 to-rose-500/20',
            hoverColor: 'group-hover:from-pink-500/30 group-hover:to-rose-500/30'
        },
        {
            id: 2,
            name: 'Pashmina',
            description: 'Pashmina kasmir lembut dan hangat',
            icon: Sparkles,
            image: '/user/modelhijab.jpg',
            color: 'from-purple-500/20 to-indigo-500/20',
            hoverColor: 'group-hover:from-purple-500/30 group-hover:to-indigo-500/30'
        },
        {
            id: 3,
            name: 'Bergo Instant',
            description: 'Bergo praktis untuk aktivitas sehari-hari',
            icon: Heart,
            image: '/user/modelhijab.jpg',
            color: 'from-blue-500/20 to-cyan-500/20',
            hoverColor: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30'
        },
        {
            id: 4,
            name: 'Hijab Premium',
            description: 'Koleksi hijab premium untuk acara spesial',
            icon: Star,
            image: '/user/modelhijab.jpg',
            color: 'from-amber-500/20 to-orange-500/20',
            hoverColor: 'group-hover:from-amber-500/30 group-hover:to-orange-500/30'
        }
    ]

    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-primary mb-4">
                        Kategori Pilihan
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Temukan koleksi hijab terbaik kami berdasarkan kategori favorit Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link
                                key={category.id}
                                to="/catalog"
                                search={{ category: category.name }}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    {/* Background Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-300`} />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 relative">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <Icon size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {category.description}
                                        </p>

                                        {/* Hover Arrow */}
                                        <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-sm font-medium">Lihat Koleksi</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
