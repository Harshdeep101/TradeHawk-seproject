
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  // Function to validate email
  const isValidEmail = (email: string) => {
    return email.includes("@");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms agreement required",
        description: "You must agree to the Terms of Service.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Register user with Supabase
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        { full_name: formData.fullName }
      );
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during sign up.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created",
          description: "Your account has been created successfully. You are now signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up.",
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
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to start buying and selling on campus
            </p>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Smith"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="agreeTerms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <a href="#" className="text-hawk-500 hover:text-hawk-600">Terms of Service</a> and <a href="#" className="text-hawk-500 hover:text-hawk-600">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-hawk-500 hover:bg-hawk-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-hawk-500 hover:text-hawk-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
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

export default SignUp;
