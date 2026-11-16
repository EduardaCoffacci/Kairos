import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?:string
}

export default function Button({ href, children, className = "", }: ButtonProps) {

  return (
    <Link
      href={href}
      className={`rounded-lg bg-[var(--kairos-orange)] px-5 py-2 font-bold text-white transition-all duration-300 hover:brightness-90 ${className}`}
    >
      {children}
    </Link>
  );
}