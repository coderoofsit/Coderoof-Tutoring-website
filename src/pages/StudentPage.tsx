import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import StudentView from "@/components/StudentView";

const StudentPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
      <StudentView />
    </div>
  );
};

export default StudentPage;
