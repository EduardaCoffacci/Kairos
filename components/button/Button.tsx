import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const styles = {
    primary: "bg-[var(--kairos-orange)] text-white hover:opacity-90",
    secondary:
      "border border-white/50 text-white hover:border-[var(--kairos-orange)] hover:text-[var(--kairos-orange)]",
  };

  const classNames = `inline-flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--kairos-orange)] ${styles[variant]} ${className}`;

  return href ? (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={classNames}>
      {children}
    </button>
  );
}
