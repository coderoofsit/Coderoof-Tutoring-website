import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import AdminView from "@/components/AdminView";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/admin");
      return;
    }

    // Verify admin role
    const verifyAdmin = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.success || data.data?.role !== "admin") {
            toast.error("Access denied. Admin access required.");
            localStorage.removeItem("token");
            localStorage.removeItem("adminEmail");
            navigate("/auth/admin");
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("adminEmail");
          navigate("/auth/admin");
        }
      } catch (error) {
        console.error("Error verifying admin:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        navigate("/auth/admin");
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      <AdminView />
    </div>
  );
};

export default AdminPage;
