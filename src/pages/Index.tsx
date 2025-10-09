import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For demo purposes, redirect to student dashboard
    // In a real app, you'd implement your own authentication logic
    navigate("/student");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default Index;
