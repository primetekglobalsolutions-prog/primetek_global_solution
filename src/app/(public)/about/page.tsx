import type { Metadata } from 'next';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Primetek Global Solutions — our story, mission, vision, and the team behind world-class staffing and consulting services.',
};

const values = [
  { icon: <Heart className="w-6 h-6" />, title: 'Integrity', description: 'We build trust through transparent, ethical business practices.' },
  { icon: <Award className="w-6 h-6" />, title: 'Excellence', description: 'We strive for the highest quality in every placement and engagement.' },
  { icon: <Users className="w-6 h-6" />, title: 'Partnership', description: 'We succeed when our clients and candidates succeed together.' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Innovation', description: 'We embrace technology and data-driven approaches to deliver better outcomes.' },
];

const team = [
  { name: 'Vikram Reddy', role: 'CEO & Founder', initial: 'VR' },
  { name: 'Meera Iyer', role: 'VP, Talent Acquisition', initial: 'MI' },
  { name: 'Arjun Singh', role: 'Head of Consulting', initial: 'AS' },
  { name: 'Sneha Patel', role: 'Director, Operations', initial: 'SP' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container-wide text-center">
          <span className="inline-block text-primary-300 font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-4xl mx-auto">
            Building the Future of Workforce Solutions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Founded with a vision to bridge the gap between exceptional talent and forward-thinking organizations.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading label="Our Story" title="From Vision to Impact" centered={false} />
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Primetek Global Solutions was founded with a singular focus: to transform how businesses find and retain top talent. What started as a boutique IT staffing firm has grown into a comprehensive workforce solutions provider serving enterprises across industries.
                </p>
                <p>
                  Today, we operate at the intersection of human expertise and intelligent technology, helping over 500 organizations build high-performing teams that drive real business outcomes.
                </p>
                <p>
                  Our deep industry knowledge, combined with a rigorous screening process and commitment to cultural fit, ensures every placement delivers lasting value.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl font-bold text-primary-500">10+</span>
                  <p className="text-text-secondary mt-2 font-medium">Years of Excellence</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-gold-400 flex items-center justify-center shadow-lg">
                <span className="text-navy-900 font-bold text-lg">500+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-surface-alt">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 md:p-10 border-l-4 border-l-primary-500">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary-500" />
                <h3 className="text-2xl font-heading font-bold text-navy-900">Our Vision</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                To be the most trusted global partner for talent solutions, recognized for our commitment to excellence, innovation, and the success of every candidate and client we serve.
              </p>
            </Card>
            <Card className="p-8 md:p-10 border-l-4 border-l-gold-500">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-gold-500" />
                <h3 className="text-2xl font-heading font-bold text-navy-900">Our Mission</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                To empower organizations with world-class talent and strategic consulting, creating lasting partnerships that drive measurable business growth and career advancement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeading label="Our Values" title="What Drives Us" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-500 mb-5">
                  {value.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-2">{value.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-surface-alt">
        <div className="container-wide">
          <SectionHeading label="Leadership" title="Meet the Team" description="Experienced professionals driving innovation in workforce solutions." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="text-center p-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-heading font-bold text-navy-900">{member.name}</h3>
                <p className="text-text-secondary text-sm mt-1">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
