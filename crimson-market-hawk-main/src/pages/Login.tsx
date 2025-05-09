
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Sign In to TradeHawk</h1>
            <p className="text-muted-foreground mt-2">
              Enter your details to access your account
            </p>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@university.edu"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-sm text-hawk-500 hover:text-hawk-600"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-hawk-500 hover:bg-hawk-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-hawk-500 hover:text-hawk-600 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 text-white py-4">
        <div className="container">
          <p className="text-center text-sm">&copy; 2025 TradeHawk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
