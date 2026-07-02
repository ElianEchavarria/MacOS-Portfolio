import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";
import Dock from "@/components/Dock";
import BootSequence from "@/components/BootSequence";


export default function Home() {
  return (
    <BootSequence>
      <main className="w-dvw h-dvh overflow-hidden">
        <Navbar />
        <Welcome />
        <Dock />
      </main>
    </BootSequence>
  );
}
