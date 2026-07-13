interface IconBoxProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "knowledge" | "featured" | "success";
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export function IconBox({
  icon,
  size = "md",
  variant = "default",
  onClick,
  ariaLabel,
  className = "",
}: IconBoxProps) {
  const sizeClass = `archron-icon-box--${size}`;
  const variantClass = variant !== "default" ? `archron-icon-box--${variant}` : "";
  const classes = `archron-icon-box ${sizeClass} ${variantClass} ${className}`.trim();

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel}>
        {icon}
      </button>
    );
  }

  return <div className={classes}>{icon}</div>;
}
