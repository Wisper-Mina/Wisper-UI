import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h2 className="font-sora text-[100px]">Unauthorized</h2>
      <p className="mt-8 text-[72px]">401</p>
      <Link
        href="/"
        className="bg-secondary py-2 px-4 rounded-lg shadow-lg text-black text-2xl"
      >
        Go back to home
      </Link>
    </div>
  );
}
