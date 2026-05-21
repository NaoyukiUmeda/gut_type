import Link from "next/link";

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  /** true の場合は外部リンク(LINE等)として扱う */
  external?: boolean;
  /** "primary" は緑のCTA、"secondary" は控えめなテキストリンク */
  variant?: "primary" | "secondary";
};

export default function CTAButton({
  href,
  children,
  external = false,
  variant = "primary",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center text-center transition-colors";
  const styles =
    variant === "primary"
      ? "bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl px-8 py-4 shadow-sm w-full max-w-xs"
      : "text-stone-500 hover:text-stone-700 underline underline-offset-4 text-sm";

  const className = `${base} ${styles}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
