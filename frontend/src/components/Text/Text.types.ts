import { AriaRole } from "react";

export type TextProps = {
  children: React.ReactNode;
  as?: "p" | "span";
  size?: "sm" | "base" | "lg";
  className?: string;
  id?: string;
  role?: AriaRole;
};
