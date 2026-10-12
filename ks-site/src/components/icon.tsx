import Image from "next/image";
import { assetPath } from "@/lib/paths";

type IconProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

export default function Icon({
  src,
  alt,
  size = 18,
  className = "",
}: IconProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
}
