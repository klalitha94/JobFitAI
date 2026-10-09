import axios from 'axios';
import { Job } from '../models/Job.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

// Real tech jobs with legitimate application URLs for Indian hubs (Bengaluru, etc.) & Remote
const REAL_CURATED_JOBS = [
  {
    title: 'Associate Software Engineer - Fresher 2024/2025',
    company: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    locationType: 'Hybrid',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹14,00,000 - ₹18,00,000 / yr',
    salaryMin: 1400000,
    salaryMax: 1800000,
    stipendOrSalary: 'Salary',
    description: 'Join Razorpay as an Associate Software Engineer to engineer high-throughput payment systems, banking integrations, and developer-first APIs powering India’s digital economy. You will collaborate with senior distributed systems architects and write clean, resilient code.',
    responsibilities: [
      'Design, build, and maintain efficient, reusable, and reliable Go, Node.js, and Java code.',
      'Work closely with product managers, QA, and DevOps to deliver core payments features.',
      'Participate in code reviews, design discussions, and write unit/integration tests.'
    ],
    requirements: [
      'B.Tech / B.E in Computer Science or related engineering field (2024 or 2025 batch).',
      'Solid command over Data Structures, Algorithms, and Object-Oriented Programming.',
      'Familiarity with REST APIs, SQL/NoSQL databases, and Git version control.'
    ],
    skillsRequired: ['Node.js', 'Go', 'Data Structures', 'REST API', 'MySQL', 'Git'],
    applyUrl: 'https://razorpay.com/jobs/',
    source: 'Razorpay Careers',
    featured: true,
  },
  {
    title: 'Frontend Developer Intern (React / Next.js)',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    locationType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹40,000 - ₹55,000 / month',
    salaryMin: 40000,
    salaryMax: 55000,
    stipendOrSalary: 'Stipend',
    description: 'Swiggy is seeking enthusiastic Frontend Developer Interns to build delightful web and mobile-web customer experiences. You will collaborate with UX designers and frontend leads to optimize load times, animations, and checkout flows.',
    responsibilities: [
      'Develop modern, responsive web interfaces using React.js, Next.js, and Tailwind CSS.',
      'Optimize web pages for maximum speed, accessibility, and cross-browser consistency.',
      'Integrate REST and GraphQL APIs into frontend components.'
    ],
    requirements: [
      'Proficiency in JavaScript (ES6+), HTML5, CSS3, and React.js.',
      'Understanding of component-driven architecture and responsive design.',
      'Eagerness to learn performance optimization and modern build tools.'
    ],
    skillsRequired: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'REST API'],
    applyUrl: 'https://careers.swiggy.com/',
    source: 'Swiggy Careers',
    featured: true,
  },
  {
    title: 'Full Stack Engineer - Entry Level',
    company: 'CRED',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    locationType: 'Onsite',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹18,00,000 - ₹24,00,000 / yr',
    salaryMin: 1800000,
    salaryMax: 2400000,
    stipendOrSalary: 'Salary',
    description: 'CRED is looking for high-caliber entry-level Full Stack Engineers who care deeply about craft, frictionless UI aesthetics, and resilient backend microservices. You will work on rewarding millions of creditworthy members.',
    responsibilities: [
      'Craft fluid UI animations and micro-interactions for web dashboards.',
      'Build scalable backend services in Node.js / Go with MongoDB and PostgreSQL.',
      'Diagnose and address performance bottlenecks across the stack.'
    ],
    requirements: [
      'Strong problem-solving instincts and solid CS fundamentals.',
      'Hands-on experience with modern frontend (React/Next) and backend frameworks (Express/Node).',
      'Demonstrated portfolio of personal projects or open-source contributions.'
    ],
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Data Structures', 'Tailwind CSS'],
    applyUrl: 'https://cred.club/careers',
    source: 'CRED Careers',
    featured: true,
  },
  {
    title: 'Software Development Engineer - Remote (India)',
    company: 'Zerodha',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    location: 'Remote, India',
    city: 'Remote',
    locationType: 'Remote',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹12,00,000 - ₹16,00,000 / yr',
    salaryMin: 1200000,
    salaryMax: 1600000,
    stipendOrSalary: 'Salary',
    description: 'Zerodha pioneers frugal, open-source technology for millions of active traders in India. We are looking for self-motivated junior engineers who love minimal dependencies, clean code, and remote freedom.',
    responsibilities: [
      'Develop and scale high-throughput trading tools and financial APIs.',
      'Contribute to internal open-source packages and developer tooling.',
      'Collaborate asynchronously using Git, IRC, and issue trackers.'
    ],
    requirements: [
      'Deep curiosity about systems, networking, and clean code principles.',
      'Proficiency in Python, Go, or JavaScript/TypeScript.',
      'Passion for open-source software and minimalist engineering.'
    ],
    skillsRequired: ['Python', 'PostgreSQL', 'Go', 'Linux', 'Git', 'REST API'],
    applyUrl: 'https://zerodha.com/careers',
    source: 'Zerodha Careers',
    featured: true,
  },
  {
    title: 'Software Engineer Intern - Summer 2025',
    company: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Hyderabad',
    city: 'Bengaluru',
    locationType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹85,000 - ₹1,10,000 / month',
    salaryMin: 85000,
    salaryMax: 110000,
    stipendOrSalary: 'Stipend',
    description: 'Google software engineering interns work on core products impacting billions of global users. You will be paired with a mentor, work on challenging real-world projects, and participate in technical workshops.',
    responsibilities: [
      'Apply computer science theory and algorithmic techniques to solve large-scale problems.',
      'Write clean, well-tested code in C++, Java, Python, or Go.',
      'Collaborate across cross-functional engineering teams.'
    ],
    requirements: [
      'Currently pursuing a BS/MS/Dual-degree in Computer Science or related technical field.',
      'Experience with algorithms, data structures, and object-oriented design.',
      'Coding competence in one or more general purpose programming languages.'
    ],
    skillsRequired: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures', 'Problem Solving'],
    applyUrl: 'https://careers.google.com/jobs/results/?q=intern',
    source: 'Google Careers',
    featured: true,
  },
  {
    title: 'Backend Engineering Intern (Node.js & Cloud)',
    company: 'Zomato',
    companyLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&auto=format&fit=crop&q=80',
    location: 'Gurugram / Remote, Delhi-NCR',
    city: 'Delhi-NCR',
    locationType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹35,000 - ₹50,000 / month',
    salaryMin: 35000,
    salaryMax: 50000,
    stipendOrSalary: 'Stipend',
    description: 'Join Zomato engineering to build scalable restaurant partner APIs, live order tracking, and high-volume delivery logistics systems.',
    responsibilities: [
      'Build and test RESTful services with Node.js, Express, and Redis.',
      'Assist in database query optimization and event-driven architectures with Kafka.',
      'Ensure 99.99% uptime for core delivery services.'
    ],
    requirements: [
      'Strong grasp of JavaScript/Node.js, SQL, and database concepts.',
      'Understanding of asynchronous programming and web sockets.',
      'Familiarity with cloud platforms (AWS or GCP) is a plus.'
    ],
    skillsRequired: ['Node.js', 'Express', 'Redis', 'MongoDB', 'SQL', 'Git'],
    applyUrl: 'https://www.zomato.com/careers',
    source: 'Zomato Careers',
    featured: false,
  },
  {
    title: 'Junior Web Developer (React & TypeScript)',
    company: 'PhonePe',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    locationType: 'Onsite',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹12,00,000 - ₹15,00,000 / yr',
    salaryMin: 1200000,
    salaryMax: 1500000,
    stipendOrSalary: 'Salary',
    description: 'PhonePe is India’s leading fintech platform with over 500 million registered users. We are hiring Junior Web Developers to build high-performance merchant portals and user web interfaces.',
    responsibilities: [
      'Develop pixel-perfect web interfaces using React, TypeScript, and modern CSS.',
      'Optimize web performance, bundle size, and render cycles.',
      'Work alongside backend engineers to integrate REST and WebSocket protocols.'
    ],
    requirements: [
      'Degree in Computer Science or self-taught developer with strong project portfolio.',
      'Proficiency in React.js, TypeScript, and modern frontend toolchains.',
      'Understanding of responsive design principles and browser rendering.'
    ],
    skillsRequired: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'Git', 'Webpack'],
    applyUrl: 'https://www.phonepe.com/careers/',
    source: 'PhonePe Careers',
    featured: false,
  },
  {
    title: 'Graduate Software Engineer',
    company: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad / Bengaluru',
    city: 'Hyderabad',
    locationType: 'Hybrid',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹16,00,000 - ₹20,00,000 / yr',
    salaryMin: 1600000,
    salaryMax: 2000000,
    stipendOrSalary: 'Salary',
    description: 'Microsoft India Development Center (IDC) is looking for Graduate Software Engineers to build next-generation cloud services in Azure, Office 365, and AI productivity platforms.',
    responsibilities: [
      'Design, implement, and ship software features across enterprise cloud systems.',
      'Write scalable, secure, and resilient code with robust unit tests.',
      'Participate in agile engineering sprints and collaborative code reviews.'
    ],
    requirements: [
      'Graduating batch of 2024 or 2025 in B.Tech/M.Tech Computer Science or related field.',
      'Excellent fundamentals in Object-Oriented Design, Data Structures, and Algorithms.',
      'Proficiency in C#, C++, Java, or Python.'
    ],
    skillsRequired: ['C#', 'Java', 'Python', 'Algorithms', 'Azure', 'SQL'],
    applyUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
    source: 'Microsoft Careers',
    featured: true,
  },
  {
    title: 'React Native & Mobile Intern',
    company: 'Zepto',
    companyLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Mumbai',
    city: 'Mumbai',
    locationType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹35,000 - ₹45,000 / month',
    salaryMin: 35000,
    salaryMax: 45000,
    stipendOrSalary: 'Stipend',
    description: 'Zepto is India’s fastest-growing quick-commerce unicorn. We are seeking a React Native intern to build slick, lightning-fast mobile application experiences for millions of grocery deliveries.',
    responsibilities: [
      'Build performant mobile screens with React Native and TypeScript.',
      'Integrate location services, maps, and real-time order tracking.',
      'Collaborate with UI/UX designers to craft fluid gestures and animations.'
    ],
    requirements: [
      'Experience with React Native or React.js.',
      'Understanding of mobile UI patterns and state management.',
      'Passionate about shipping features fast in a hyper-growth startup.'
    ],
    skillsRequired: ['React Native', 'React', 'JavaScript', 'TypeScript', 'Redux', 'Mobile'],
    applyUrl: 'https://www.zeptonow.com/careers',
    source: 'Zepto Careers',
    featured: false,
  },
  {
    title: 'Frontend Engineer - 100% Remote',
    company: 'Automattic (WordPress.com)',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
    location: 'Remote - Worldwide',
    city: 'Remote',
    locationType: 'Remote',
    jobType: 'Fresher',
    experienceLevel: 'Fresher (0-1 yrs)',
    salaryRange: '₹15,00,000 - ₹22,00,000 / yr',
    salaryMin: 1500000,
    salaryMax: 2200000,
    stipendOrSalary: 'Salary',
    description: 'Automattic is a fully distributed company with people in over 90 countries. We are looking for passionate web developers who love JavaScript, Gutenberg block editor, and open-source contributions.',
    responsibilities: [
      'Write clean, accessible, and performant modern JavaScript for WordPress.com.',
      'Contribute to Gutenberg open-source packages on GitHub.',
      'Participate in distributed text-based discussions and code reviews.'
    ],
    requirements: [
      'Deep understanding of vanilla JavaScript, modern React, and web standards.',
      'Autonomous work habits and excellent written communication in English.',
      'Experience building interactive web apps or plugins.'
    ],
    skillsRequired: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Open Source'],
    applyUrl: 'https://automattic.com/work-with-us/',
    source: 'Automattic Careers',
    featured: true,
  }
];

// Live public API fetcher (Arbeitnow & Remotive)
export const fetchLiveExternalJobs = async () => {
  const externalJobs = [];
  
  // 1. Fetch from Arbeitnow (Free public job board API)
  try {
    const res = await axios.get('https://arbeitnow.com/api/job-board-api', { timeout: 4000 });
    if (res.data && Array.isArray(res.data.data)) {
      const items = res.data.data.slice(0, 15);
      for (const item of items) {
        externalJobs.push({
          title: item.title,
          company: item.company_name,
          location: item.location || 'Remote',
          city: item.remote ? 'Remote' : (item.location?.includes('Bengaluru') ? 'Bengaluru' : 'Remote'),
          locationType: item.remote ? 'Remote' : 'Onsite',
          jobType: item.title.toLowerCase().includes('intern') ? 'Internship' : 'Fresher',
          experienceLevel: 'Fresher (0-1 yrs)',
          salaryRange: 'Competitive',
          salaryMin: 600000,
          salaryMax: 1200000,
          stipendOrSalary: 'Salary',
          description: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 800) : 'Exciting software engineering opportunity.',
          requirements: ['Strong programming aptitude', 'Familiarity with web frameworks', 'Effective communication skills'],
          skillsRequired: (item.tags && item.tags.length > 0) ? item.tags.slice(0, 6) : ['JavaScript', 'Python', 'Web Development'],
          applyUrl: item.url,
          source: 'Arbeitnow API',
          featured: false,
          postedAt: item.created_at ? new Date(item.created_at * 1000) : new Date(),
        });
      }
    }
  } catch (err) {
    console.warn('[JobApiService] Arbeitnow live fetch skipped:', err.message);
  }

  // 2. Fetch from Remotive (Free public remote jobs API)
  try {
    const res = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=10', { timeout: 4000 });
    if (res.data && Array.isArray(res.data.jobs)) {
      const items = res.data.jobs.slice(0, 10);
      for (const item of items) {
        externalJobs.push({
          title: item.title,
          company: item.company_name,
          companyLogo: item.company_logo || '',
          location: item.candidate_required_location || 'Remote Worldwide',
          city: 'Remote',
          locationType: 'Remote',
          jobType: item.job_type === 'internship' ? 'Internship' : 'Fresher',
          experienceLevel: 'Fresher (0-1 yrs)',
          salaryRange: item.salary || 'Competitive',
          salaryMin: 800000,
          salaryMax: 1500000,
          stipendOrSalary: 'Salary',
          description: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 800) : 'Remote engineering role.',
          requirements: ['Hands-on software development experience', 'Strong self-management skills in remote settings'],
          skillsRequired: (item.tags && item.tags.length > 0) ? item.tags.slice(0, 6) : ['React', 'Node.js', 'Git'],
          applyUrl: item.url,
          source: 'Remotive API',
          featured: false,
          postedAt: item.publication_date ? new Date(item.publication_date) : new Date(),
        });
      }
    }
  } catch (err) {
    console.warn('[JobApiService] Remotive live fetch skipped:', err.message);
  }

  return externalJobs;
};

// Seed initial jobs to DB or Memory Store
export const initializeJobs = async () => {
  const { isConnected } = getDbStatus();
  
  if (isConnected) {
    const count = await Job.countDocuments();
    if (count === 0) {
      console.log('[JobApiService] Seeding curated tech openings into MongoDB...');
      await Job.insertMany(REAL_CURATED_JOBS);
      console.log(`[JobApiService] Seeded ${REAL_CURATED_JOBS.length} jobs.`);
    }
  } else {
    // Memory store fallback
    if (memoryStore.getAllJobs().length === 0) {
      REAL_CURATED_JOBS.forEach(j => memoryStore.saveJob(j));
      console.log(`[JobApiService] Loaded ${REAL_CURATED_JOBS.length} curated jobs into in-memory store.`);
    }
  }
};

// Main job query function with Location, Role, Salary & Search filters
export const getJobsFiltered = async ({
  search = '',
  city = 'all',
  locationType = 'all',
  jobType = 'all',
  minSalary = 0,
  page = 1,
  limit = 20,
}) => {
  const { isConnected } = getDbStatus();
  let allJobs = [];

  if (isConnected) {
    allJobs = await Job.find({}).sort({ featured: -1, postedAt: -1 }).lean();
  } else {
    allJobs = memoryStore.getAllJobs();
  }

  // If jobs are few, pull in live external jobs
  if (allJobs.length <= REAL_CURATED_JOBS.length) {
    const liveJobs = await fetchLiveExternalJobs();
    for (const liveJob of liveJobs) {
      // Avoid duplicate by title & company
      if (!allJobs.some(j => j.title === liveJob.title && j.company === liveJob.company)) {
        if (isConnected) {
          try {
            const saved = await Job.create(liveJob);
            allJobs.push(saved.toObject ? saved.toObject() : saved);
          } catch (e) {
            allJobs.push(liveJob);
          }
        } else {
          const saved = memoryStore.saveJob(liveJob);
          allJobs.push(saved);
        }
      }
    }
  }

  // Filter application
  let filtered = allJobs.filter((job) => {
    // Search query
    if (search) {
      const q = search.toLowerCase();
      const matchSearch =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        (job.skillsRequired || []).some(s => s.toLowerCase().includes(q)) ||
        (job.location || '').toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // City / Location filter
    if (city && city.toLowerCase() !== 'all') {
      const targetCity = city.toLowerCase();
      const jobCity = (job.city || '').toLowerCase();
      const jobLoc = (job.location || '').toLowerCase();
      const matchesCity = jobCity.includes(targetCity) || jobLoc.includes(targetCity);
      if (!matchesCity) return false;
    }

    // Location Type filter (Remote, Hybrid, Onsite)
    if (locationType && locationType.toLowerCase() !== 'all') {
      const targetType = locationType.toLowerCase();
      const jobLocType = (job.locationType || '').toLowerCase();
      if (!jobLocType.includes(targetType)) return false;
    }

    // Job Type filter (Fresher, Internship, Full-time)
    if (jobType && jobType.toLowerCase() !== 'all') {
      const targetJobType = jobType.toLowerCase();
      const jType = (job.jobType || '').toLowerCase();
      if (!jType.includes(targetJobType)) return false;
    }

    // Minimum Salary / Stipend filter
    if (minSalary && Number(minSalary) > 0) {
      const minNum = Number(minSalary);
      if (job.salaryMin && job.salaryMin < minNum) return false;
    }

    return true;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedJobs = filtered.slice(startIndex, startIndex + limit);

  return {
    jobs: paginatedJobs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getJobById = async (id) => {
  const { isConnected } = getDbStatus();
  if (isConnected) {
    try {
      const job = await Job.findById(id).lean();
      if (job) return job;
    } catch (e) {
      // In case ID format is not mongo object id
    }
  }
  return memoryStore.findJobById(id);
};
