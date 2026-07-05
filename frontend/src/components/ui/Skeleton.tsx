type SkeletonVariant = "text" | "circular" | "rectangular" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantClass: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "h-10 w-10 rounded-full",
  rectangular: "h-32 w-full rounded-lg",
  card: "h-48 w-full rounded-xl",
};

export default function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse-loader bg-neutral-100 ${variantClass[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
