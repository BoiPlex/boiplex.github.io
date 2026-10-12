import Image from "next/image";

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
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
}