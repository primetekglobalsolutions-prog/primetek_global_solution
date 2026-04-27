import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700" />

      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container-wide relative text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 max-w-3xl mx-auto leading-tight">
          Ready to Transform Your Workforce?
        </h2>
        <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
          Let&apos;s discuss how Primetek can help you build high-performing teams and drive business growth.
        </p>
        <Link href="/contact">
          <Button
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-50 hover:text-primary-700 shadow-xl hover:shadow-2xl"
          >
            Contact Us Today <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
