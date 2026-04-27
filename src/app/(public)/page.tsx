import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import ServicesOverview from '@/components/sections/ServicesOverview';
import Testimonials from '@/components/sections/Testimonials';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesOverview />
      <Testimonials />
      <CTASection />
    </>
  );
}
