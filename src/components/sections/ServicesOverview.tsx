'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Users, BarChart3, Globe, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';

const services = [
  {
    icon: <Users className="w-7 h-7" />,
    title: 'IT & Non-IT Staffing',
    description:
      'Access a vast network of pre-vetted professionals for contract, full-time, and temp-to-hire positions across industries.',
    features: ['Contract Staffing', 'Full-Time Hiring', 'Temp-to-Hire', 'Executive Search'],
    href: '/services#staffing',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Consulting',
    description:
      'Strategic consulting services to optimize your operations, accelerate digital transformation, and drive measurable growth.',
    features: ['Strategy Advisory', 'Digital Transformation', 'Process Optimization', 'Change Management'],
    href: '/services#consulting',
    color: 'from-gold-500 to-gold-600',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Outsourcing',
    description:
      'End-to-end outsourcing solutions that reduce costs, improve efficiency, and let you focus on what matters most.',
    features: ['BPO Services', 'KPO Services', 'IT Outsourcing', 'Managed Services'],
    href: '/services#outsourcing',
    color: 'from-navy-600 to-navy-800',
  },
];

export default function ServicesOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          label="What We Do"
          title="Comprehensive Workforce Solutions"
          description="From sourcing top talent to optimizing your operations, we deliver results that matter."
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card className="h-full flex flex-col group">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-navy-900 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-grow">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm hover:gap-3 transition-all duration-200"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
