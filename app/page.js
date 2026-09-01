import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";
import Dock from "@/components/Dock";
import DesktopIcons from "@/components/DesktopIcons";
import MobileHome from "@/components/MobileHome";
import WindowLayer from "@/components/WindowLayer";
import BootSequence from "@/components/BootSequence";


export default function Home() {
  return (
    <BootSequence>
      <main className="w-dvw h-dvh overflow-hidden">
        <Navbar />
        <DesktopIcons />
        <MobileHome />
        <Welcome />
        <WindowLayer />
        <Dock />
      </main>
    </BootSequence>
  );
}
