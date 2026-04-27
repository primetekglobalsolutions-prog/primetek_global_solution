import type { Metadata } from 'next';
import { Users, BarChart3, Globe, Briefcase, UserCheck, Settings, Cpu, HeadphonesIcon, Database, CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Explore Primetek Global Solutions\' comprehensive services — IT & Non-IT Staffing, Strategic Consulting, and Business Outsourcing.',
};

const serviceCategories = [
  {
    id: 'staffing',
    icon: <Users className="w-8 h-8" />,
    title: 'IT & Non-IT Staffing',
    gradient: 'from-primary-500 to-primary-700',
    description: 'We connect top talent with leading organizations across all skill levels and industries.',
    subservices: [
      { icon: <Briefcase className="w-5 h-5" />, title: 'Contract Staffing', description: 'Flexible workforce solutions for project-based needs with rapid deployment.' },
      { icon: <UserCheck className="w-5 h-5" />, title: 'Full-Time Hiring', description: 'End-to-end recruitment for permanent roles — from sourcing to onboarding.' },
      { icon: <Settings className="w-5 h-5" />, title: 'Temp-to-Hire', description: 'Evaluate talent on the job before committing to a full-time offer.' },
      { icon: <Users className="w-5 h-5" />, title: 'Executive Search', description: 'C-suite and senior leadership recruitment for mission-critical roles.' },
    ],
  },
  {
    id: 'consulting',
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Strategic Consulting',
    gradient: 'from-gold-500 to-gold-600',
    description: 'Data-driven advisory services that optimize operations and accelerate growth.',
    subservices: [
      { icon: <BarChart3 className="w-5 h-5" />, title: 'Strategy Advisory', description: 'Business strategy and market analysis for competitive advantage.' },
      { icon: <Cpu className="w-5 h-5" />, title: 'Digital Transformation', description: 'Modernize your tech stack and workflows for the digital era.' },
      { icon: <Settings className="w-5 h-5" />, title: 'Process Optimization', description: 'Streamline operations to reduce costs and improve efficiency.' },
      { icon: <Users className="w-5 h-5" />, title: 'Change Management', description: 'Navigate organizational transformation with structured methodology.' },
    ],
  },
  {
    id: 'outsourcing',
    icon: <Globe className="w-8 h-8" />,
    title: 'Outsourcing Solutions',
    gradient: 'from-navy-600 to-navy-800',
    description: 'Scalable outsourcing partnerships that let you focus on core business.',
    subservices: [
      { icon: <HeadphonesIcon className="w-5 h-5" />, title: 'BPO Services', description: 'Customer support, data entry, and back-office process management.' },
      { icon: <Database className="w-5 h-5" />, title: 'KPO Services', description: 'Research, analytics, and knowledge-intensive process outsourcing.' },
      { icon: <Cpu className="w-5 h-5" />, title: 'IT Outsourcing', description: 'Software development, maintenance, and infrastructure management.' },
      { icon: <Settings className="w-5 h-5" />, title: 'Managed Services', description: 'End-to-end IT operations management with SLA guarantees.' },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container-wide text-center">
          <span className="inline-block text-primary-300 font-semibold text-sm uppercase tracking-widest mb-3">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-4xl mx-auto">
            Comprehensive Workforce Solutions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From talent acquisition to strategic consulting — everything you need to build and scale high-performing teams.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      {serviceCategories.map((category, catIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`section-padding ${catIndex % 2 === 0 ? 'bg-white' : 'bg-surface-alt'}`}
        >
          <div className="container-wide">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-navy-900">{category.title}</h2>
                <p className="text-text-secondary mt-1">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.subservices.map((sub) => (
                <Card key={sub.title} className="p-6">
                  <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                    {sub.icon}
                  </div>
                  <h3 className="font-heading font-bold text-navy-900 mb-2">{sub.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{sub.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Us */}
      <section className="section-padding bg-navy-900">
        <div className="container-wide">
          <SectionHeading label="Why Primetek" title="Our Competitive Edge" light />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Deep industry expertise across 15+ verticals',
              'Rigorous 6-stage candidate screening process',
              'Average 48-hour time-to-shortlist',
              '98% client satisfaction rate',
              'Dedicated account manager for every client',
              'ISO-certified quality management processes',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <span className="text-gray-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
