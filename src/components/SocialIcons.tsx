import { SOCIALS } from "@/lib/config";

type Props = {
  size?: number;
  className?: string;
  iconClassName?: string;
};

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04C2.69 8.5 2.68 8.86 2.68 12s.01 3.5.06 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.42 3.42 0 0 0-.83-1.27 3.42 3.42 0 0 0-1.27-.83c-.39-.15-.97-.33-2.04-.38C15.5 4.01 15.14 4 12 4Zm0 3.07a4.93 4.93 0 1 1 0 9.86 4.93 4.93 0 0 1 0-9.86Zm0 1.8a3.13 3.13 0 1 0 0 6.26 3.13 3.13 0 0 0 0-6.26Zm5.13-2.04a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

export function SnapchatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.2 2c2.6 0 5.1 1.85 5.7 4.4.2.95.13 2.04.07 2.95l-.02.32c-.04.6-.07 1.06.05 1.27.07.13.3.27.55.4.36.2.84.34 1.27.5.36.13.7.34.7.74 0 .56-.55.96-1.66 1.2-.1.02-.18.07-.22.16-.04.1-.04.2 0 .3.16.4.7 1.45 2.1 1.7.13.02.23.13.25.27a.4.4 0 0 1-.13.36c-.46.4-1.5.6-2.5.74-.07 0-.15.13-.18.27a4.5 4.5 0 0 1-.16.6.27.27 0 0 1-.27.18h-.07a4.65 4.65 0 0 1-.96-.13c-.34-.07-.7-.13-1.16-.13-.27 0-.55.02-.85.07-.6.1-1.1.45-1.7.85-.84.6-1.8 1.27-3.18 1.27-.06 0-.13 0-.18-.02h-.13c-1.4 0-2.34-.67-3.18-1.27-.6-.4-1.1-.74-1.7-.85-.3-.05-.58-.07-.85-.07-.46 0-.82.07-1.16.13-.42.07-.74.13-.96.13-.16 0-.25-.07-.27-.18-.07-.16-.13-.4-.16-.6-.03-.14-.1-.27-.18-.27-1-.13-2.04-.34-2.5-.74a.4.4 0 0 1-.13-.36c.02-.13.13-.25.25-.27 1.4-.25 1.94-1.3 2.1-1.7.04-.1.04-.22 0-.3-.04-.1-.13-.16-.22-.16C2.55 13 2 12.6 2 12.04c0-.4.34-.6.7-.74.43-.16.9-.3 1.27-.5.25-.13.48-.27.55-.4.13-.22.1-.67.05-1.27v-.32c-.06-.92-.13-2 .07-2.96A5.83 5.83 0 0 1 12.2 2Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function SocialRow({ size = 18, className = "", iconClassName = "" }: Props) {
  const cls = `h-[${size}px] w-[${size}px] ${iconClassName}`.trim();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={SOCIALS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram QalbOfSilk"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
      >
        <InstagramIcon className={cls} />
      </a>
      <a
        href={SOCIALS.snapchat}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Snapchat QalbOfSilk"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-[#FFFC00] hover:text-black hover:border-[#FFFC00]"
      >
        <SnapchatIcon className={cls} />
      </a>
      <a
        href={`mailto:${SOCIALS.email}`}
        aria-label="Email QalbOfSilk"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
      >
        <MailIcon className={cls} />
      </a>
    </div>
  );
}
