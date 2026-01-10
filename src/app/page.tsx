import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative h-[calc(100vh-2.75rem)] w-full">
      {/* URL-encoded space in filename */}
      <Image
        alt="slopdog crew"
        className="object-contain"
        fill
        priority
        src="/data/slopdog-crew-new-output%20(Current).png"
      />
    </div>
  );
}

