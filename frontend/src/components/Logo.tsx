import { assets } from "../../public/assets/assets";
import { useNavigate } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <img
      src={assets.logo}
      alt="logo"
      className={`h-8 md:h-10 w-auto cursor-pointer ${className}`}
      onClick={() => navigate("/")}
    />
  );
}
