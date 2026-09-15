import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    ShoppingBasket, 
    Truck, 
    Leaf, 
    Clock, 
    ShieldCheck,
    Star,
    ChevronRight,
    Apple,
    Carrot,
    Milk,
    Wheat,
    Egg,
    Fish
} from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="FreshMart - Your Local Grocery Store" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300">
                                🎉 Free Delivery on First Order
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                Fresh Groceries
                                <span className="text-green-600 dark:text-green-400"> Delivered</span> to Your Door
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                Quality produce, dairy, meats, and more from local farmers. Order online and get same-day delivery.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                                        Start Shopping
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-8 pt-4">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">4.9</span>
                                    <span className="text-gray-600 dark:text-gray-400">(2.5k reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Truck className="h-5 w-5" />
                                    <span>Free delivery over $50</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-3xl transform rotate-3 opacity-20"></div>
                            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Apple className="h-12 w-12 text-red-500 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fruits</span>
                                    </div>
                                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Carrot className="h-12 w-12 text-orange-500 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vegetables</span>
                                    </div>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Milk className="h-12 w-12 text-blue-500 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dairy</span>
                                    </div>
                                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Wheat className="h-12 w-12 text-amber-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bakery</span>
                                    </div>
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Egg className="h-12 w-12 text-yellow-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Eggs</span>
                                    </div>
                                    <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-4 flex flex-col items-center justify-center">
                                        <Fish className="h-12 w-12 text-cyan-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Seafood</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <Card className="border-2 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <CardHeader>
                                <Truck className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                                <CardTitle>Free Delivery</CardTitle>
                                <CardDescription>Free same-day delivery on orders over $50</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-2 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <CardHeader>
                                <Leaf className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                                <CardTitle>Fresh & Organic</CardTitle>
                                <CardDescription>100% fresh produce from local farmers</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-2 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <CardHeader>
                                <Clock className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                                <CardTitle>Fast Service</CardTitle>
                                <CardDescription>Order by 2 PM, get it by 6 PM</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-2 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                            <CardHeader>
                                <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                                <CardTitle>Quality Guarantee</CardTitle>
                                <CardDescription>Not satisfied? Get a full refund</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Shop by Category</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Browse our wide selection of fresh products</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { icon: Apple, name: 'Fruits', count: '150+', color: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-500' },
                            { icon: Carrot, name: 'Vegetables', count: '200+', color: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-500' },
                            { icon: Milk, name: 'Dairy', count: '80+', color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-500' },
                            { icon: Wheat, name: 'Bakery', count: '50+', color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
                            { icon: Egg, name: 'Eggs', count: '30+', color: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600' },
                            { icon: Fish, name: 'Seafood', count: '60+', color: 'bg-cyan-100 dark:bg-cyan-900/30', iconColor: 'text-cyan-600' },
                        ].map((category, index) => (
                            <Link key={index} href="/shop">
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-300 dark:hover:border-green-700">
                                    <CardContent className="p-6 text-center">
                                        <div className={`${category.color} rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4`}>
                                            <category.icon className={`h-10 w-10 ${category.iconColor}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{category.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} items</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Special Offers</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Limited time deals you don't want to miss</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                                <Badge className="bg-white text-green-600">50% OFF</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>Weekly Fresh Box</CardTitle>
                                <CardDescription>Curated selection of seasonal fruits and vegetables</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$24.99</span>
                                    <span className="text-xl text-gray-500 line-through">$49.99</span>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700">Add to Cart</Button>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-2 border-orange-200 dark:border-orange-800">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4">
                                <Badge className="bg-white text-orange-600">BOGO FREE</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>Organic Eggs</CardTitle>
                                <CardDescription>Free-range organic eggs, dozen pack</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$5.99</span>
                                    <span className="text-sm text-gray-500">Buy 1 Get 1 Free</span>
                                </div>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">Add to Cart</Button>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
                                <Badge className="bg-white text-blue-600">30% OFF</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle>Premium Dairy Pack</CardTitle>
                                <CardDescription>Milk, cheese, yogurt bundle</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$19.99</span>
                                    <span className="text-xl text-gray-500 line-through">$28.99</span>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Why Choose FreshMart?</h2>
                        <p className="text-xl text-green-100">We're committed to bringing you the best</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-white/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                                <ShoppingBasket className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Wide Selection</h3>
                            <p className="text-green-100">Over 5,000 products from local farms and brands</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                                <Leaf className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Farm Fresh</h3>
                            <p className="text-green-100">Direct from farmers within 24 hours of harvest</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Trusted Quality</h3>
                            <p className="text-green-100">Every product inspected for freshness and quality</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Our Customers Say</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Join thousands of happy shoppers</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <CardDescription className="text-base">
                                    "The freshest produce I've ever had delivered! The quality is consistently amazing and the delivery is always on time."
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                                        <span className="text-green-600 dark:text-green-400 font-bold">SM</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Sarah M.</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Regular Customer</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <CardDescription className="text-base">
                                    "Finally a grocery service that understands quality! Their organic selection is incredible and prices are very competitive."
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">JD</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">John D.</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Family of 4</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <CardDescription className="text-base">
                                    "The app is so easy to use and the customer service is excellent. They replaced a damaged item immediately without any hassle."
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center">
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">EW</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">Emily W.</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Busy Professional</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <Card className="max-w-3xl mx-auto border-2 border-green-200 dark:border-green-800">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">Get 10% Off Your First Order</CardTitle>
                            <CardDescription className="text-lg">
                                Subscribe to our newsletter for exclusive deals, recipes, and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Input 
                                    placeholder="Enter your email address" 
                                    className="flex-1 h-12 text-base"
                                />
                                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                    Subscribe
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                                No spam, unsubscribe at any time. We respect your privacy.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
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
