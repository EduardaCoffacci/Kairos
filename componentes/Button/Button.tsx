
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const styles = `rounded-lg bg-[var(--kairos-orange)] px-5 py-2 font-bold text-white transition-all duration-300 hover:brightness-90 ${className}`;

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
