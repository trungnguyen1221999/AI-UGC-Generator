import { UserButton } from "@clerk/clerk-react";
import { SparklesIcon, FolderEditIcon, HomeIcon, UsersIcon, DollarSignIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const navigate = useNavigate();
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="Generate"
          labelIcon={<SparklesIcon size={14} />}
          onClick={() => navigate("/generate")}
        />
        <UserButton.Action
          label="My Generations"
          labelIcon={<FolderEditIcon size={14} />}
          onClick={() => navigate("/my-generations")}
        />
        <UserButton.Action
          label="Home"
          labelIcon={<HomeIcon size={14} />}
          onClick={() => navigate("/")}
        />
        <UserButton.Action
          label="Community"
          labelIcon={<UsersIcon size={14} />}
          onClick={() => navigate("/community")}
        />
        <UserButton.Action
          label="Plans"
          labelIcon={<DollarSignIcon size={14} />}
          onClick={() => navigate("/plan")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
