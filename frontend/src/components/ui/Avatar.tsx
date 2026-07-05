import Image from "next/image";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const pixelSizes: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const bgColors = [
  "bg-primary",
  "bg-primary-dark",
  "bg-cta",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-blue-600",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return bgColors[Math.abs(hash) % bgColors.length];
}

export default function Avatar({ src, name, size = "md", online, className = "" }: AvatarProps) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className={`${sizeStyles[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full flex items-center justify-center text-white font-semibold ${getColor(name)}`}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}
