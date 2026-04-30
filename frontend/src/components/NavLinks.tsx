import { Link, useLocation } from "react-router-dom";

export default function NavLinks({
  links,
  activeClass = "",
  linkClass = "",
  onClick,
  language,
}: {
  links: { href: string; text: Record<string, string> }[];
  activeClass?: string;
  linkClass?: string;
  onClick?: () => void;
  language: string;
}) {
  const location = useLocation();
  return (
    <>
      {links.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClick}
          className={`${linkClass} ${location.pathname === item.href ? activeClass : ""}`.trim()}
        >
          {item.text[language]}
        </Link>
      ))}
    </>
  );
}
