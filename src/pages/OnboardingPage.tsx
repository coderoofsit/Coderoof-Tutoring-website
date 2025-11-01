import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalizationWizard from "@/components/PersonalizationWizard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const storedName = localStorage.getItem("studentName");
      
      if (!token) {
        // Not authenticated, redirect to login
        navigate("/auth/student");
        return;
      }

      if (storedName) {
        setStudentName(storedName);
        setLoading(false);
      } else {
        // Fetch user info from API
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setStudentName(data.data.name);
              localStorage.setItem("studentName", data.data.name);
            }
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <PersonalizationWizard studentName={studentName} />
  );
};

export default OnboardingPage;
