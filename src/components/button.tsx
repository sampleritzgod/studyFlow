import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "md" | "sm";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps & {
  href: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return ["button", `button-${variant}`, size === "sm" ? "button-compact" : null, className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const classes = buttonClassName(props.variant, props.size, props.className);

  if ("href" in props && typeof props.href === "string") {
    return (
      <Link className={classes} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;

  return (
    <button
      className={classes}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      form={buttonProps.form}
      formAction={buttonProps.formAction}
      name={buttonProps.name}
      value={buttonProps.value}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </button>
  );
}
