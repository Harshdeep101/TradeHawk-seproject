
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ListingForm from "@/components/ListingForm";
import { useAuth } from "@/contexts/AuthContext";

const Sell = () => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-hawk-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container px-4 py-8 md:px-6 max-w-3xl">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Sell Your Item</h1>
            <p className="text-muted-foreground max-w-lg">
              List your textbooks, electronics, or other items for sale and connect with buyers on campus.
            </p>
          </div>
        </div>
        
        {/* Authentication check message */}
        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-0.5 text-amber-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <p className="font-medium">You need to sign in to list items</p>
                <p className="text-sm text-muted-foreground">
                  Please <Link to="/login" className="text-hawk-500 font-medium hover:underline">sign in</Link> or <Link to="/signup" className="text-hawk-500 font-medium hover:underline">create an account</Link> to continue.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {user ? (
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <ListingForm />
          </div>
        ) : (
          <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-hawk-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="font-bold text-lg mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to create listings on TradeHawk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <button className="w-full bg-hawk-500 hover:bg-hawk-600 text-white px-4 py-2 rounded">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full border border-hawk-500 text-hawk-500 hover:bg-hawk-50 px-4 py-2 rounded">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 bg-muted rounded-lg p-6">
          <h2 className="font-bold text-lg mb-3">Listing Guidelines</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hawk-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              <span>Be honest about the condition of your items</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hawk-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              <span>Include clear photos from multiple angles</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hawk-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              <span>Provide a detailed description with relevant information</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hawk-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              <span>Set a reasonable price based on condition and market value</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hawk-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              <span>Meet buyers in public locations on campus for safety</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Footer - simplified version */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <p>&copy; 2025 TradeHawk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sell;
