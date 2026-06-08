import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";

export default function Home() {
  return (
    <main className="w-dvw h-dvh overflow-hidden">
      <Navbar />
      <Welcome />
    </main>
  );
}
