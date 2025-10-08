import { Users, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleToggleProps {
  isAdmin: boolean;
  onToggle: () => void;
}

const RoleToggle = ({ isAdmin, onToggle }: RoleToggleProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={onToggle}
        variant={isAdmin ? "default" : "secondary"}
        className="shadow-lg transition-all duration-300"
      >
        {isAdmin ? (
          <>
            <UserCog className="w-4 h-4 mr-2" />
            Admin View
          </>
        ) : (
          <>
            <Users className="w-4 h-4 mr-2" />
            Student View
          </>
        )}
      </Button>
    </div>
  );
};

export default RoleToggle;
