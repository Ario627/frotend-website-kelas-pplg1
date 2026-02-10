
import { PixelNav } from "@/components/pixel/pixel-nav";
import { HeroSection } from "@/components/sections/hero-section";
import LoginPage from "./(auth)/portal/gate/page";
import RegisterPage from "./(auth)/portal/enroll/page";
import { AnnouncementPreview } from "@/components/sections/announcement-preview";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PixelNav />
      <main className="flex-1">
        <HeroSection />
        <AnnouncementPreview />
      </main>
    </div>
  )
}
