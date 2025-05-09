import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Laptop, BookOpen, Trophy, ShoppingBag, ShieldCheck, Clock, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hawk-600 to-hawk-500 text-white py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
                Campus Trading Made Easy
              </h1>
              <p className="md:text-xl text-hawk-100 max-w-[600px] animate-fade-in">
                Buy and sell textbooks, electronics, sports equipment, and more with TradeHawk - the marketplace for university students.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
                <Link to="/buy">
                  <Button size="lg" className="bg-white text-hawk-600 hover:bg-hawk-100">
                    Browse Items
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-hawk-600">
                    Sell Something
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="University students"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Browse Categories</h2>
            <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Electronics Category */}
            <Link to="/buy?category=electronics" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg group-hover:translate-y-[-5px]">
                <div className="aspect-video bg-blue-100 flex items-center justify-center">
                  <Laptop className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Electronics</h3>
                  <p className="text-muted-foreground mb-4">Laptops, phones, accessories and more</p>
                  <div className="flex items-center text-hawk-500 font-medium group-hover:text-hawk-600">
                    Browse Electronics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Books Category */}
            <Link to="/buy?category=books" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg group-hover:translate-y-[-5px]">
                <div className="aspect-video bg-amber-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-amber-600" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Books</h3>
                  <p className="text-muted-foreground mb-4">Textbooks, novels, study guides and more</p>
                  <div className="flex items-center text-hawk-500 font-medium group-hover:text-hawk-600">
                    Browse Books
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Sports Category */}
            <Link to="/buy?category=sports" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg group-hover:translate-y-[-5px]">
                <div className="aspect-video bg-green-100 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-green-600" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Sports</h3>
                  <p className="text-muted-foreground mb-4">Equipment, apparel, accessories and more</p>
                  <div className="flex items-center text-hawk-500 font-medium group-hover:text-hawk-600">
                    Browse Sports
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Other Category */}
            <Link to="/buy?category=other" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg group-hover:translate-y-[-5px]">
                <div className="aspect-video bg-purple-100 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Other</h3>
                  <p className="text-muted-foreground mb-4">Furniture, decor, miscellaneous items and more</p>
                  <div className="flex items-center text-hawk-500 font-medium group-hover:text-hawk-600">
                    Browse Other
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">How TradeHawk Works</h2>
            <p className="text-muted-foreground mt-2">Trading made simple in three easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-hawk-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hawk-500 h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3 className="font-bold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">Sign up with your university email to verify you're a student</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-hawk-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hawk-500 h-6 w-6"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg>
              </div>
              <h3 className="font-bold mb-2">List or Browse</h3>
              <p className="text-muted-foreground">Upload items to sell or browse what others are offering</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-hawk-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hawk-500 h-6 w-6"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
              </div>
              <h3 className="font-bold mb-2">Make a Deal</h3>
              <p className="text-muted-foreground">Connect with other students and exchange items on campus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Safety Guidelines</h2>
            <p className="text-muted-foreground mt-2">Stay safe while trading on campus</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-hawk-500">
                <ShieldCheck className="h-8 w-8 mr-3" />
                <h3 className="font-bold text-lg">Meet in Public Places</h3>
              </div>
              <p className="text-gray-600">Always arrange meetings in busy campus locations like the student union, library, or cafeteria. Avoid secluded areas or meeting off-campus.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-hawk-500">
                <MessageCircle className="h-8 w-8 mr-3" />
                <h3 className="font-bold text-lg">Verify Identity</h3>
              </div>
              <p className="text-gray-600">Communicate through the platform and verify that the other party is a fellow student. Request to see student ID when meeting if necessary.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-hawk-500">
                <Clock className="h-8 w-8 mr-3" />
                <h3 className="font-bold text-lg">Inspect Before Exchanging</h3>
              </div>
              <p className="text-gray-600">Take time to thoroughly inspect items before completing any transaction. For electronics, test functionality before finalizing the purchase.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/safety">
              <Button variant="outline" className="bg-transparent border-hawk-500 text-hawk-500 hover:bg-hawk-500 hover:text-white">
                View All Safety Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hawk-500 h-6 w-6"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                <span className="text-xl font-bold font-heading">TradeHawk</span>
              </div>
              <p className="text-gray-400">The trusted marketplace for university students</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/buy" className="text-gray-400 hover:text-white">Buy</Link></li>
                <li><Link to="/sell" className="text-gray-400 hover:text-white">Sell</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Safety Guidelines</a></li>
                <li>
                  <div className="text-gray-400 hover:text-white">
                    Contact Us:
                    <div className="mt-1">Phone: (799) 566-7999</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Stay Updated</h3>
              <div className="flex mt-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none bg-gray-800 border-gray-700 focus:ring-hawk-500"
                />
                <Button className="rounded-l-none bg-hawk-500 hover:bg-hawk-600">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Get notifications about new items
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TradeHawk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
