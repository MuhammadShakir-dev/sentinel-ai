import logo from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <img
      src={logo}
      alt="CyberShield logo"
      width={size}
      height={size}
      className={`rounded-lg object-cover bg-foreground ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
