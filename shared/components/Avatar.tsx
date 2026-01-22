import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      size = "md",
      verified = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-xl",
    };

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {src ? (
          <Image
            src={src}
            alt={alt || "Avatar"}
            className={`${sizes[size]} rounded-full object-cover ring-2 ring-emerald-400/20`}
            width={64}
            height={64}
          />
        ) : (
          <div
            className={`${sizes[size]} rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold`}
          >
            {initials}
          </div>
        )}
        {verified && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-[#0f1419]">
            <svg
              className="w-3 h-3 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
