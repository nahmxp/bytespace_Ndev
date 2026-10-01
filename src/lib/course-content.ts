import { categoryLabel } from "./categories";
import { SEED_COURSES } from "./seed-data";
import type { CourseDTO, CourseDetailDTO, ModuleDTO } from "./types";

const img = (n: string) => `/images/courses/${n}.webp`;
const GALLERY = [img("wireframe"), img("uikit"), img("workspace"), img("apps")];
const MINUTES = [12, 21, 16, 18, 24, 19, 27];

/** Hand-written content that mirrors the Figma design for the flagship course. */
const BUILD_DIGITAL_ASSET = {
  headline: "Build Digital Asset: A Comprehensive Guide",
  subtitle: "Unlock the Power of Digital Creation with Expert Guidance",
  hero: img("preview-asset"),
  students: 199,
  reviewCount: 172,
  description: [
    `Embark on an enlightening exploration into the world of digital creation with our comprehensive course, "Build Digital Assets: A Comprehensive Guide." This transformative learning experience invites you to delve deep into the intricacies of crafting impactful digital content. From laying the groundwork with foundational concepts to mastering advanced techniques, this guide is meticulously curated to empower you with the skills essential for navigating the dynamic landscape of digital asset creation.`,
    `In the initial modules, you'll establish a solid foundation by immersing yourself in the foundational concepts that form the backbone of digital asset creation. Understand the fundamental elements that constitute compelling digital content and gain proficiency in leveraging these elements to communicate effectively in the digital realm.`,
    `As you progress through the course, you'll ascend to higher levels of expertise, delving into the nuances of design principles that drive impactful creations. Uncover the secrets behind effective visual communication, exploring color theory, typography, and layout strategies that elevate your digital assets to new heights. Engage in hands-on exercises that reinforce your understanding, allowing you to apply these principles in practical scenarios.`,
  ],
  keyPoints: [
    "Foundational Concepts",
    "Design Principles Mastery",
    "Advanced Techniques in Digital Creation",
    "Project Showcase and Critique",
    "Optimizing for Various Platforms",
    "Digital Asset Management Best Practices",
    "Monetization Strategies",
    "Capstone Project: Building Your Portfolio",
  ],
  modules: [
    { title: "Module 1: Introduction to Digital Assets", summary: "Lay the groundwork with lessons like 'Understanding Digital Elements' and 'Navigating Design Software Tools.' Dive into the essentials of digital asset creation.", minutes: 12 },
    { title: "Module 2: Design Principles for Impact", summary: "Master the principles that drive impactful designs with lessons such as 'Color Theory in Digital Design' and 'Typography Essentials.' Elevate your visual communication skills.", minutes: 21 },
    { title: "Module 3: Advanced Techniques in Digital Creation", summary: "Go beyond the basics with layered compositions, reusable components, and efficient workflows that scale across projects.", minutes: 16 },
    { title: "Module 4: User-Centric Design Strategies", summary: "Understand 'Design Thinking in Digital Creation' and delve into 'User Experience (UX) Essentials.' Craft digital assets with a focus on user-centric design.", minutes: 18 },
    { title: "Module 5: Interactive Media and Engagement", summary: "Engage your audience with lessons like 'Creating Interactive Presentations' and 'Integrating Multimedia Elements.' Master the art of creating immersive digital experiences.", minutes: 24 },
    { title: "Module 6: Project Showcase and Critique", summary: "Perfect your presentation skills with 'Effective Presentation Techniques' and embrace collaboration with 'Peer Critique and Collaboration.' Showcase your work with confidence.", minutes: 19 },
    { title: "Module 7: Optimizing Digital Assets for Various Platforms", summary: "Adapt your digital creations for 'Mobile Platforms' and optimize for 'Social Media.' Ensure widespread accessibility and engagement across diverse digital landscapes.", minutes: 27 },
  ] satisfies ModuleDTO[],
};

function generic(c: CourseDTO) {
  const topic = c.title;
  const field = categoryLabel(c.categories.find((x) => x !== "featured") ?? "featured");
  const titles = [
    `Introduction to ${topic}`,
    "Core Principles and Fundamentals",
    "Hands-on Techniques",
    "Workflows That Scale",
    "Project Showcase and Critique",
    "Optimizing for the Real World",
    "Capstone: Build Your Portfolio",
  ];
  const summaries = [
    `Get oriented with the big picture of ${topic} and set up everything you need to follow along.`,
    `Master the core ideas behind ${field.toLowerCase()} so every later lesson clicks into place.`,
    "Put the theory to work with guided, practical exercises you can reuse in your own projects.",
    "Learn repeatable workflows and shortcuts that keep your work fast, consistent and maintainable.",
    "Present your progress, give and receive feedback, and sharpen your work with peer critique.",
    "Adapt what you've built to different platforms, audiences and constraints with confidence.",
    "Bring everything together in a capstone project that becomes a portfolio-ready showpiece.",
  ];
  return {
    headline: topic,
    subtitle: `Learn ${topic} step by step with expert guidance`,
    hero: c.image,
    students: Math.max(c.enrolled * 6 + 13, 40),
    reviewCount: Math.max(Math.round(c.comments * 2.4), 12),
    description: [
      `Welcome to "${topic}", a practical ${c.level.toLowerCase()}-level course in ${field.toLowerCase()} from ${c.creator}. Across ${c.lessons} lessons (${c.duration}) you'll move from first principles to confident, real-world application.`,
      `Each module pairs short, focused video lessons with hands-on exercises, so you learn by doing. You'll build a foundation in the essentials, then layer on the techniques professionals rely on every day.`,
      `By the end, you'll have a finished project, a repeatable workflow, and the confidence to keep growing. Learn at your own pace with lifetime access to every lesson and update.`,
    ],
    keyPoints: [
      "Foundational Concepts",
      "Core Principles Mastery",
      "Hands-on Techniques",
      "Scalable Workflows",
      "Project Showcase and Critique",
      "Optimizing for the Real World",
      "Best Practices from Working Pros",
      "Capstone Project: Building Your Portfolio",
    ],
    modules: titles.map((t, i) => ({ title: `Module ${i + 1}: ${t}`, summary: summaries[i], minutes: MINUTES[i] })),
  };
}

export function buildDetail(c: CourseDTO): CourseDetailDTO {
  const extra = c.slug === "build-digital-asset" ? BUILD_DIGITAL_ASSET : generic(c);
  return { ...c, gallery: GALLERY, ...extra };
}

export const SEED_COURSE_DETAILS: CourseDetailDTO[] = SEED_COURSES.map(buildDetail);
