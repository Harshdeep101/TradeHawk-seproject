
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <rect width="64" height="64" rx="16" fill="#EA384C" />
              <path d="M18 22H32V18H18V22Z" fill="white" />
              <path d="M18 34H32V30H18V34Z" fill="white" />
              <path d="M48 42H18V46H48V42Z" fill="white" />
              <path d="M32 24L32 40H36L36 24L32 24Z" fill="white" />
              <path d="M44 22L38 29L48 29L44 22Z" fill="white" />
            </svg>
            <span className="font-heading font-bold text-xl tracking-tight">TradeHawk</span>
          </Link>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="text-base font-medium hover:text-hawk-500">Home</Link>
            <Link to="/buy" className="text-base font-medium hover:text-hawk-500">Buy</Link>
            <Link to="/sell" className="text-base font-medium hover:text-hawk-500">Sell</Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="hidden md:block">
                <span className="text-sm mr-2">Hello, {user.user_metadata?.full_name || 'User'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:inline-flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-hawk-500 hover:bg-hawk-600 hidden md:inline-flex">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          
          <button
            className="md:hidden p-2 -m-2"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block py-2 text-base font-medium hover:text-hawk-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/buy"
              className="block py-2 text-base font-medium hover:text-hawk-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buy
            </Link>
            <Link
              to="/sell"
              className="block py-2 text-base font-medium hover:text-hawk-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell
            </Link>
            <div className="pt-4 pb-2 border-t border-gray-200">
              {user ? (
                <>
                  <div className="py-2 text-sm">Signed in as: {user.user_metadata?.full_name || user.email}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="bg-hawk-500 hover:bg-hawk-600 w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
