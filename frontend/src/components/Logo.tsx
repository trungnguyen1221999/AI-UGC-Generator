import { assets } from '../../public/assets/assets';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img src={assets.logo} alt="logo" className={`h-10 w-auto ${className}`} />
  );
}
