interface LogoProps {
  className?: string;
  /** Height in pixels the logo renders at. Width follows the image's natural aspect ratio. */
  size?: number;
}

/**
 * The Blood Bridge brand mark. Centralized here so every place it appears
 * (navbar, footer, dashboard sidebar, auth pages) stays in sync — update
 * the asset once in /public and every usage picks it up.
 *
 * Sized by height only (not width×height) because the source mark is wider
 * than it is tall — forcing it into a square box shrinks it visibly smaller
 * than surrounding text at the same nominal "size".
 */
export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt=""
      role="presentation"
      className={className}
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}
