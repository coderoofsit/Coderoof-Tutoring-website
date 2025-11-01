import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft } from "lucide-react";

const StudentAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("studentName", data.data.user.name);
          toast.success("Successfully logged in!");

          // Check if onboarding is completed
          const profileResponse = await fetch(`${API_URL}/student-profile`, {
            headers: {
              Authorization: `Bearer ${data.data.token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.data && profileData.data.onboardingCompleted) {
              navigate("/student");
            } else {
              navigate("/onboarding");
            }
          } else {
            navigate("/onboarding");
          }
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        // Sign up
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: studentName,
            email,
            password,
            role: "student",
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("studentName", studentName);
          toast.success("Account created successfully!");
          // Redirect to onboarding after signup
          navigate("/onboarding");
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Student Login" : "Student Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to book tutoring sessions" : "Join our tutoring platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  type="text"
                  placeholder="John Doe"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login Options
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAuth;
