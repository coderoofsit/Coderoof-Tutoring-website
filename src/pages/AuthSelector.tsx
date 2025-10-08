import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, GraduationCap, Users } from "lucide-react";

const AuthSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
          <p className="text-muted-foreground">Choose your login type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Login Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Student Login</CardTitle>
              <CardDescription>
                Book tutoring sessions and track your requests
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate("/auth/student")}
                className="w-full"
                size="lg"
              >
                Login as Student
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Admin Login</CardTitle>
              <CardDescription>
                Manage sessions, approve requests, and assign teachers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate("/auth/admin")}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            New to the platform? Students can create accounts during the login process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSelector;
