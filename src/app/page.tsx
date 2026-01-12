import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative h-[calc(100vh-2.75rem)] w-full flex items-center justify-center bg-mocha-base">
      <div className="relative w-full h-full max-w-6xl mx-auto p-8">
        <Image
          alt="slopdog crew"
          className="object-contain"
          fill
          priority
          src="/data/slopdog-crew-new-output (Current).png"
        />
      </div>
    </div>
  );
}
