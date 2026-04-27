export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'contract' | 'remote' | 'part-time';
  description: string;
  requirements: string;
  salary_range: string;
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  experience_years: number;
  cover_letter: string;
  resume_url: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected';
  notes: string;
  created_at: string;
}

export const demoJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Senior React Developer',
    department: 'Information Technology',
    location: 'Hyderabad',
    type: 'full-time',
    description: 'We are looking for a Senior React Developer to join our client\'s product engineering team. You will architect and build complex web applications using React, Next.js, and TypeScript, collaborating with cross-functional teams to deliver high-quality solutions.',
    requirements: '• 5+ years of React/Next.js experience\n• Strong TypeScript proficiency\n• Experience with REST APIs and GraphQL\n• Knowledge of state management (Redux, Zustand)\n• Understanding of CI/CD pipelines\n• Excellent communication skills',
    salary_range: '₹18L – ₹28L',
    is_active: true,
    created_at: '2026-04-25T10:00:00Z',
  },
  {
    id: 'job-002',
    title: 'Cloud Solutions Architect',
    department: 'Information Technology',
    location: 'Bangalore',
    type: 'full-time',
    description: 'Design and implement scalable cloud infrastructure on AWS/Azure for enterprise clients. Lead migration projects and establish cloud governance best practices.',
    requirements: '• 7+ years in cloud architecture (AWS/Azure/GCP)\n• AWS Solutions Architect certification preferred\n• Experience with Terraform, CloudFormation\n• Strong networking and security knowledge\n• Experience leading technical teams',
    salary_range: '₹30L – ₹45L',
    is_active: true,
    created_at: '2026-04-24T09:00:00Z',
  },
  {
    id: 'job-003',
    title: 'DevOps Engineer',
    department: 'Information Technology',
    location: 'Remote',
    type: 'remote',
    description: 'Build and maintain CI/CD pipelines, container orchestration, and monitoring infrastructure for our client\'s SaaS platform.',
    requirements: '• 3+ years DevOps experience\n• Docker, Kubernetes proficiency\n• Jenkins/GitHub Actions CI/CD\n• Monitoring: Prometheus, Grafana, ELK\n• Linux administration skills\n• Scripting (Python/Bash)',
    salary_range: '₹15L – ₹22L',
    is_active: true,
    created_at: '2026-04-23T14:00:00Z',
  },
  {
    id: 'job-004',
    title: 'Healthcare IT Consultant',
    department: 'Healthcare',
    location: 'Hyderabad',
    type: 'contract',
    description: 'Advise healthcare organizations on EMR/EHR implementation, HIPAA compliance, and digital health transformation projects.',
    requirements: '• 5+ years healthcare IT consulting\n• Knowledge of HL7, FHIR standards\n• HIPAA compliance expertise\n• Experience with EMR systems (Epic, Cerner)\n• PMP or equivalent certification preferred',
    salary_range: '₹20L – ₹32L',
    is_active: true,
    created_at: '2026-04-22T11:00:00Z',
  },
  {
    id: 'job-005',
    title: 'Financial Risk Analyst',
    department: 'Banking & Finance',
    location: 'Bangalore',
    type: 'full-time',
    description: 'Analyze and monitor credit, market, and operational risk for a leading banking institution. Build risk models and reporting dashboards.',
    requirements: '• 3+ years in risk management/analytics\n• CFA/FRM certification preferred\n• Proficiency in Python, R, or SAS\n• Strong Excel and SQL skills\n• Knowledge of Basel III/IV regulations',
    salary_range: '₹12L – ₹20L',
    is_active: true,
    created_at: '2026-04-21T10:00:00Z',
  },
  {
    id: 'job-006',
    title: 'Supply Chain Manager',
    department: 'Manufacturing',
    location: 'Hyderabad',
    type: 'full-time',
    description: 'Oversee end-to-end supply chain operations for a manufacturing client. Optimize procurement, logistics, and inventory management processes.',
    requirements: '• 6+ years supply chain management\n• APICS/CSCP certification preferred\n• Experience with SAP/Oracle ERP\n• Strong analytical and negotiation skills\n• Knowledge of lean manufacturing',
    salary_range: '₹14L – ₹22L',
    is_active: true,
    created_at: '2026-04-20T09:00:00Z',
  },
  {
    id: 'job-007',
    title: 'UX/UI Designer',
    department: 'Information Technology',
    location: 'Remote',
    type: 'remote',
    description: 'Create intuitive, visually stunning user experiences for web and mobile applications. Work closely with product and engineering teams.',
    requirements: '• 3+ years UX/UI design experience\n• Proficiency in Figma, Adobe XD\n• Understanding of design systems\n• Experience with user research and testing\n• Portfolio showcasing previous work',
    salary_range: '₹10L – ₹18L',
    is_active: true,
    created_at: '2026-04-19T13:00:00Z',
  },
  {
    id: 'job-008',
    title: 'Data Engineer',
    department: 'Information Technology',
    location: 'Bangalore',
    type: 'contract',
    description: 'Design and build scalable data pipelines, data warehouses, and ETL processes for analytics and machine learning workloads.',
    requirements: '• 4+ years data engineering experience\n• Python, SQL, Spark proficiency\n• Experience with Airflow, dbt\n• Cloud data platforms (Snowflake, BigQuery, Redshift)\n• Knowledge of data modeling best practices',
    salary_range: '₹16L – ₹26L',
    is_active: true,
    created_at: '2026-04-18T10:00:00Z',
  },
  {
    id: 'job-009',
    title: 'E-Commerce Operations Manager',
    department: 'Retail & E-Commerce',
    location: 'Hyderabad',
    type: 'full-time',
    description: 'Manage day-to-day e-commerce operations including catalog management, order fulfillment, and marketplace optimization for a major retail brand.',
    requirements: '• 4+ years e-commerce operations\n• Experience with Shopify, Magento, or WooCommerce\n• Knowledge of marketplace platforms (Amazon, Flipkart)\n• Strong analytical and project management skills\n• Google Analytics proficiency',
    salary_range: '₹10L – ₹16L',
    is_active: true,
    created_at: '2026-04-17T11:00:00Z',
  },
  {
    id: 'job-010',
    title: 'QA Automation Engineer',
    department: 'Information Technology',
    location: 'Remote',
    type: 'remote',
    description: 'Design and implement automated testing frameworks for web and API testing. Drive quality standards and reduce regression cycles.',
    requirements: '• 3+ years QA automation experience\n• Selenium, Cypress, or Playwright proficiency\n• API testing (Postman, RestAssured)\n• CI/CD integration experience\n• ISTQB certification a plus',
    salary_range: '₹8L – ₹15L',
    is_active: true,
    created_at: '2026-04-16T09:00:00Z',
  },
];

export const demoApplications: Application[] = [
  { id: 'app-001', job_id: 'job-001', job_title: 'Senior React Developer', name: 'Aditya Sharma', email: 'aditya@email.com', phone: '+91 98765 11111', experience_years: 6, cover_letter: 'Passionate React developer with 6 years of experience building enterprise SaaS products.', resume_url: '#', status: 'new', notes: '', created_at: '2026-04-27T08:00:00Z' },
  { id: 'app-002', job_id: 'job-001', job_title: 'Senior React Developer', name: 'Neha Gupta', email: 'neha@email.com', phone: '+91 98765 22222', experience_years: 5, cover_letter: 'Full-stack developer transitioning to frontend with strong React skills.', resume_url: '#', status: 'reviewing', notes: 'Strong portfolio, schedule technical round', created_at: '2026-04-26T14:00:00Z' },
  { id: 'app-003', job_id: 'job-002', job_title: 'Cloud Solutions Architect', name: 'Vikram Desai', email: 'vikram@email.com', phone: '+91 98765 33333', experience_years: 9, cover_letter: 'AWS certified architect with 9 years of cloud transformation experience.', resume_url: '#', status: 'shortlisted', notes: 'Excellent fit, moving to final round', created_at: '2026-04-25T10:00:00Z' },
  { id: 'app-004', job_id: 'job-003', job_title: 'DevOps Engineer', name: 'Ravi Kumar', email: 'ravi@email.com', phone: '', experience_years: 4, cover_letter: 'DevOps engineer specializing in Kubernetes and AWS infrastructure.', resume_url: '#', status: 'new', notes: '', created_at: '2026-04-24T16:00:00Z' },
  { id: 'app-005', job_id: 'job-005', job_title: 'Financial Risk Analyst', name: 'Pooja Menon', email: 'pooja@email.com', phone: '+91 98765 55555', experience_years: 3, cover_letter: 'CFA Level 2 candidate with hands-on risk modeling experience in banking.', resume_url: '#', status: 'rejected', notes: 'Insufficient experience for the role', created_at: '2026-04-23T09:00:00Z' },
  { id: 'app-006', job_id: 'job-007', job_title: 'UX/UI Designer', name: 'Ananya Reddy', email: 'ananya@email.com', phone: '+91 98765 66666', experience_years: 4, cover_letter: 'Creative designer with experience at top agencies and tech startups.', resume_url: '#', status: 'reviewing', notes: 'Beautiful portfolio, check availability', created_at: '2026-04-22T11:00:00Z' },
];

// ─── Employee & Attendance (Phase 3) ───

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  password: string;
  is_active: boolean;
  joined_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string;
  check_out: string;
  duration_hours: number;
  lat: number;
  lng: number;
  status: 'present' | 'late' | 'absent' | 'half-day';
}

export const demoEmployees: Employee[] = [
  { id: 'emp-001', name: 'Rajesh Kumar', email: 'rajesh@primetek.com', phone: '+91 98765 10001', department: 'Information Technology', designation: 'Senior Developer', password: 'employee123', is_active: true, joined_at: '2024-03-15' },
  { id: 'emp-002', name: 'Sneha Patel', email: 'sneha@primetek.com', phone: '+91 98765 10002', department: 'Information Technology', designation: 'UX Designer', password: 'employee123', is_active: true, joined_at: '2024-06-01' },
  { id: 'emp-003', name: 'Amit Singh', email: 'amit@primetek.com', phone: '+91 98765 10003', department: 'Healthcare', designation: 'IT Consultant', password: 'employee123', is_active: true, joined_at: '2025-01-10' },
  { id: 'emp-004', name: 'Divya Reddy', email: 'divya@primetek.com', phone: '+91 98765 10004', department: 'Banking & Finance', designation: 'Risk Analyst', password: 'employee123', is_active: true, joined_at: '2025-04-20' },
  { id: 'emp-005', name: 'Kiran Verma', email: 'kiran@primetek.com', phone: '+91 98765 10005', department: 'Manufacturing', designation: 'Supply Chain Lead', password: 'employee123', is_active: false, joined_at: '2024-09-01' },
];

function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const activeEmps = demoEmployees.filter((e) => e.is_active);
  const today = new Date();

  for (let dayOffset = 1; dayOffset <= 20; dayOffset++) {
    const d = new Date(today);
    d.setDate(d.getDate() - dayOffset);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends

    for (const emp of activeEmps) {
      const isLate = Math.random() < 0.15;
      const isAbsent = Math.random() < 0.08;
      if (isAbsent) {
        records.push({
          id: `att-${emp.id}-${dayOffset}`,
          employee_id: emp.id,
          employee_name: emp.name,
          date: d.toISOString().split('T')[0],
          check_in: '',
          check_out: '',
          duration_hours: 0,
          lat: 0,
          lng: 0,
          status: 'absent',
        });
        continue;
      }
      const checkInHour = isLate ? 10 + Math.floor(Math.random() * 2) : 9;
      const checkInMin = Math.floor(Math.random() * 30);
      const durationH = 7 + Math.random() * 2;
      records.push({
        id: `att-${emp.id}-${dayOffset}`,
        employee_id: emp.id,
        employee_name: emp.name,
        date: d.toISOString().split('T')[0],
        check_in: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
        check_out: `${String(checkInHour + Math.floor(durationH)).padStart(2, '0')}:${String(Math.floor((durationH % 1) * 60)).padStart(2, '0')}`,
        duration_hours: Math.round(durationH * 10) / 10,
        lat: 17.385 + (Math.random() - 0.5) * 0.002,
        lng: 78.4867 + (Math.random() - 0.5) * 0.002,
        status: isLate ? 'late' : 'present',
      });
    }
  }

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

export const demoAttendance: AttendanceRecord[] = generateAttendance();
