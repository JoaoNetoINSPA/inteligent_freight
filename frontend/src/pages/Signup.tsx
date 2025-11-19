import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const Signup = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    if (!companyName || !companyAddress || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        company_name: companyName,
        company_address: companyAddress,
        email,
        password,
      });
      
      toast({
        title: "Account Created",
        description: "Your company account has been created successfully",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <Package className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold">Intelligent Freight</h1>
          <p className="text-muted-foreground mt-2">Create your carrier account</p>
        </div>

        <form 
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Company Name *</label>
            <Input
              placeholder="Your Carrier Company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Company Address *</label>
            <Input
              placeholder="123 Main St, City, State"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <Input
              type="email"
              placeholder="admin@yourcarrier.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Password *</label>
            <Input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <Button 
            type="submit"
            className="w-full" 
            size="lg" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
