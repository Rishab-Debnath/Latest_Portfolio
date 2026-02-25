import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  carrent,
  jobit,
  tripguide,
  threejs,
  Fiverr,
  KS,
  Lisys,
  NIC,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full-Stack Development",
    icon: web,
  },
  {
    title: "Backend Engineering",
    icon: backend,
  },
  {
    title: "AI & Machine Learning",
    icon: creator,
  },
  {
    title: "System Optimization",
    icon: mobile,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Freelance Full-Stack Developer",
    company_name: "Self-Employed | Remote",
    icon: Fiverr,
    iconBg: "#383E56",
    date: "Oct 2025 – Present",
    points: [
      "Designed and deployed high-performance websites for real-estate and construction clients with conversion-focused UI and responsive layouts.",
      "Built scalable frontend architectures using React (Vite), modular component patterns, and modern CSS strategies.",
      "Developed secure RESTful backend services using Node.js with structured API design and data validation.",
      "Optimized performance, SEO structure, and cross-device compatibility to ensure smooth production-level delivery."
    ],
  },

  {
    title: "Machine Learning Intern",
    company_name: "Kristl Seibt India Pvt. Ltd. | Pune",
    icon: KS,
    iconBg: "#E6DEDD",
    date: "Oct 2024 – Jun 2025",
    points: [
      "Developed a YOLOv8s-based AI system for automated component detection and inventory management.",
      "Built an NLP mapping model to convert European electrical parts into Indian equivalents using semantic similarity techniques.",
      "Engineered a PyQt6 desktop application integrating real-time detection, dataset labeling, and inventory tracking.",
      "Achieved 95% detection accuracy and reduced manual inventory effort by 80% while contributing to the AutoLabeller module."
    ],
  },

  {
    title: "Full-Stack Developer",
    company_name: "LiSYS Technocraft LLP | Pune",
    icon: Lisys,
    iconBg: "#E6DEDD",
    date: "Apr 2024 – Aug 2024",
    points: [
      "Developed production-grade web applications using Spring Boot, MySQL, Thymeleaf, and AJAX within an Agile workflow.",
      "Engineered backend modules for event management systems handling 30–40 monthly users with optimized database queries.",
      "Improved UI/UX consistency and resolved performance bottlenecks, significantly reducing support requests.",
      "Refactored validation logic and asynchronous request handling to enhance system stability and reliability."
    ],
  },

  {
    title: "Full-Stack Developer",
    company_name: "National Informatics Centre (NIC) | Government of India",
    icon: NIC,
    iconBg: "#383E56",
    date: "May 2023 – Aug 2023",
    points: [
      "Developed secure authentication and program management modules using Spring Boot and PostgreSQL for the MATI system.",
      "Improved authentication workflows and implemented robust validation, reducing user issues by 40%.",
      "Automated backend data validation, increasing processing speed by 45% and reducing entry errors by 30%.",
      "Optimized database interactions and API performance to improve scalability and system responsiveness."
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "ML-Powered Component Detection",
    description:
      "AI-driven desktop application for automated detection and tracking of electrical components using YOLOv8s and NLP-based part mapping. Built with PyQt6 for real-time visualization and inventory management, achieving 95% detection accuracy and reducing manual effort by 80%.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "yolov8",
        color: "green-text-gradient",
      },
      {
        name: "machine-learning",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/Rishab-Debnath",
  },
  {
    name: "Online Library Management System",
    description:
      "Full-stack web application built with ASP.NET and MS SQL featuring secure authentication, RESTful APIs, and a responsive admin dashboard managing 1000+ book records. Designed for high reliability with 99.5% uptime during testing and seamless multi-device support.",
    tags: [
      {
        name: "asp.net",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
      {
        name: "mssql",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/Rishab-Debnath",
  },
  {
    name: "Smart Bookmark App",
    description:
      "Modern full-stack bookmark manager built with Next.js App Router and Supabase, featuring Google OAuth authentication, Row Level Security (RLS), and real-time PostgreSQL subscriptions. Supports secure user-specific data access with instant multi-tab synchronization and zero page refresh.",
    tags: [
      {
        name: "next.js",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "postgresql",
        color: "pink-text-gradient",
      },
      {
        name: "tailwind",
        color: "blue-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/Rishab-Debnath",
  },
];

export { services, technologies, experiences, testimonials, projects };
