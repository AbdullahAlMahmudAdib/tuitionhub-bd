import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${sizeStyles[size]} ${className}`}>
      <span className="text-primary">Tuition</span>
      <span className="text-cta">Hub</span>
      <span className="text-neutral-500 text-[0.5em] font-normal">BD</span>
    </Link>
  );
}
