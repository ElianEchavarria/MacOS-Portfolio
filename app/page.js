import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";
import Dock from "@/components/Dock";
import WindowLayer from "@/components/WindowLayer";
import BootSequence from "@/components/BootSequence";


export default function Home() {
  return (
    <BootSequence>
      <main className="w-dvw h-dvh overflow-hidden">
        <Navbar />
        <Welcome />
        <WindowLayer />
        <Dock />
      </main>
    </BootSequence>
  );
}
