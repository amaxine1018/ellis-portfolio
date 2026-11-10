import type { CSSProperties } from "react";

/**
 * Renders an SVG file as a solid shape whose color comes from a design token.
 *
 * <img src="x.svg"> cannot read CSS variables, so any color baked into the file
 * sits outside the token system. Here the SVG only supplies the shape (its
 * alpha channel); the fill is `var(token)`, e.g. token="--boost-alert".
 */
export function TokenMask({
  src,
  token,
  className,
  style,
}: {
  src: string;
  /** CSS custom property name, including the leading dashes. */
  token: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        backgroundColor: `var(${token})`,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}
