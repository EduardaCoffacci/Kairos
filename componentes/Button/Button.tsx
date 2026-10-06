import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-[var(--kairos-orange)] px-5 py-3 font-bold text-white transition-all duration-300 hover:brightness-90"
    >
      {children}
    </Link>
  );
}