import { cn } from "@/lib/cn";
import { streamEmbedUrl } from "@/lib/media";
import type { StreamPlatform } from "@/lib/types/database";

type StreamEmbedProps = {
  platform: StreamPlatform;
  // YouTube: video ID or URL. Facebook: full public video URL.
  source: string;
  // Used as the iframe's accessible name.
  title: string;
  className?: string;
};

// Responsive 16:9 player for YouTube or Facebook videos.
export default function StreamEmbed({ platform, source, title, className }: StreamEmbedProps) {
  const src = streamEmbedUrl(platform, source);

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-brand-primary shadow-card", className)}>
      {src ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-white/80">
          This video can&apos;t be played right now.
        </p>
      )}
    </div>
  );
}
