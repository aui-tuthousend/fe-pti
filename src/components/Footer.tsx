import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Hijab Store</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Koleksi hijab premium dengan desain modern dan bahan berkualitas tinggi untuk melengkapi gaya Anda.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200"
                            >
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Catalog
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Return Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                    Jl. Merdeka No. 123<br />
                                    Bandung, Jawa Barat 40123
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={18} className="text-primary flex-shrink-0" />
                                <a href="tel:+6281234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    +62 812-3456-7890
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={18} className="text-primary flex-shrink-0" />
                                <a href="mailto:info@hijabstore.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    info@hijabstore.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Hijab Store. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">We accept:</span>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-muted rounded text-xs font-medium">VISA</div>
                                <div className="px-3 py-1 bg-muted rounded text-xs font-medium">Mastercard</div>
                                <div className="px-3 py-1 bg-muted rounded text-xs font-medium">GoPay</div>
                                <div className="px-3 py-1 bg-muted rounded text-xs font-medium">OVO</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
