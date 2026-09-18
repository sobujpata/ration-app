import { Link } from '@inertiajs/react';
import { 
    ShoppingBasket, 
    
} from 'lucide-react';
export default function Footer() {
    return (
        <>
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBasket className="h-8 w-8 text-green-500" />
                                <span className="text-2xl font-bold text-white">FreshMart</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Your trusted local grocery store delivering fresh quality products to your doorstep.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                    <span className="text-sm">f</span>
                                </div>
                                <div className="bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                    <span className="text-sm">t</span>
                                </div>
                                <div className="bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                    <span className="text-sm">in</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/shop" className="hover:text-green-400 transition-colors">Shop Now</Link></li>
                                <li><Link href="/deals" className="hover:text-green-400 transition-colors">Special Deals</Link></li>
                                <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
                            <ul className="space-y-2">
                                <li><Link href="/faq" className="hover:text-green-400 transition-colors">FAQ</Link></li>
                                <li><Link href="/delivery" className="hover:text-green-400 transition-colors">Delivery Info</Link></li>
                                <li><Link href="/returns" className="hover:text-green-400 transition-colors">Returns Policy</Link></li>
                                <li><Link href="/support" className="hover:text-green-400 transition-colors">Support</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">📍</span>
                                    123 Fresh Street, Market City
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">📞</span>
                                    (555) 123-4567
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✉️</span>
                                    hello@freshmart.com
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">🕐</span>
                                    Mon-Sat: 7AM - 10PM
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 FreshMart. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
