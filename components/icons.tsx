import type { SVGProps } from "react";

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1024 1024" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        transform="scale(64)"
        fill="#ffff"
      />
    </svg>
  );
}

export function GitlabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="m31.46 12.78-.04-.12-4.35-11.35A1.14 1.14 0 0 0 25.94.6c-.24 0-.47.1-.66.24-.19.15-.33.36-.39.6l-2.94 9h-11.9l-2.94-9A1.14 1.14 0 0 0 6.07.58a1.15 1.15 0 0 0-1.14.72L.58 12.68l-.05.11a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48 6.67-5h.02a8.09 8.09 0 0 0 2.7-9.36Z"
        fill="#E24329"
      />
      <path
        d="m31.46 12.78-.04-.12a14.75 14.75 0 0 0-5.86 2.64l-9.55 7.24 6.09 4.6 6.67-5h.02a8.09 8.09 0 0 0 2.67-9.36Z"
        fill="#FC6D26"
      />
      <path
        d="m9.9 27.14 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48-6.1-4.6-6.07 4.6Z"
        fill="#FCA326"
      />
      <path
        d="M6.44 15.3a14.71 14.71 0 0 0-5.86-2.63l-.05.12a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 6.1-4.6-9.56-7.24Z"
        fill="#FC6D26"
      />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M87.3749 147.217C87.3749 157.436 81.0804 172.918 61.1561 172.886H36V83H61.6874C80.9015 83 87.3641 98.4608 87.3695 108.685L87.3749 147.217ZM62.582 99.8189C64.6856 99.8189 66.7946 100.607 68.8982 102.182C70.9963 103.757 72.0535 106.126 72.0589 109.277V147.114C72.0589 150.27 71.0071 152.633 68.9036 154.209C66.8 155.784 64.691 156.572 62.5874 156.572H53.1268V99.8189H62.582Z"
        fill="white"
      />
      <path
        d="M141.959 99.0529H113.073V119.924H130.731V135.988H113.073V156.854H141.965V172.918H108.253C102.203 173.076 97.1717 168.284 97.0199 162.222V94.2561C96.8735 88.1989 101.661 83.1684 107.706 83.0163H141.965L141.959 99.0529Z"
        fill="white"
      />
      <path
        d="M198.149 161.684C190.992 178.389 178.17 175.064 172.429 161.684L151.539 83.0217H169.197L185.305 144.8L201.336 83.0217H219L198.149 161.684Z"
        fill="white"
      />
    </svg>
  );
}

export function HashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" fill="none" {...props}>
      <path
        fill="#2563EB"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M68.692 334.16c-91.59 91.589-91.59 240.085 0 331.674L334.16 931.302c91.589 91.588 240.085 91.588 331.674-.001l265.468-265.467c91.588-91.59 91.588-240.085-.001-331.674L665.834 68.692c-91.59-91.59-240.085-91.59-331.674 0L68.692 334.16Zm431.302 330.06c90.694 0 164.216-73.522 164.216-164.216s-73.522-164.216-164.216-164.216-164.216 73.522-164.216 164.216S409.3 664.22 499.994 664.22Z"
      />
    </svg>
  );
}

export function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.12 1.631l3.854 4.126 5.406 5.788a1.374 1.374 0 0 0 2.005-.065l.484-.517a1.374 1.374 0 0 0-.063-1.954l-5.407-5.788a3.3 3.3 0 0 1-.675-1.023 3.253 3.253 0 0 1-.2-.573 3.09 3.09 0 0 1-.036-1.322 2.938 2.938 0 0 1 .675-1.455l3.854-4.126a1.374 1.374 0 0 0 .063-1.954l-.484-.517a1.374 1.374 0 0 0-1.044-.438z" />
    </svg>
  );
}

export function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export function CpuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

export function CircuitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.901 2.25h3.681l-8.042 9.19 9.46 12.31h-7.406l-5.802-7.47-6.536 7.47H.574l8.6-9.827L0 2.25h7.594l5.245 6.776L18.901 2.25zm-1.291 19.3h2.04L6.486 4.334H4.298L17.61 21.55z" />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
