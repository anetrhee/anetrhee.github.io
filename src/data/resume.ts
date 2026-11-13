// Every piece of copy on the site comes from this file.
// Source: Annette Rhee's resume (see portfolio-build-prompt_1.md). Nothing here is invented.

export type Work = {
  slug: string;
  org: string;
  /** Split for the mixed grotesk + serif-italic headline treatment. */
  orgLead: string;
  orgTail: string;
  role: string;
  dates: string;
  location?: string;
  line: string;
  /** Numeric stat (counts up) or, when there is no number on the resume, a short text stat. */
  stat?: { value: number; suffix: string; label: string };
  statText?: { value: string; label: string };
  tags: string[];
  bullets: string[];
  /** Set to e.g. '/assets/ld-social-1.png' once a real image exists. Until then a typographic cover renders. */
  image?: string;
  /** Hue used for the generated cover gradient. */
  tone: string;
};

export const person = {
  first: 'Annette',
  last: 'Rhee',
  monogram: 'AR',
  city: 'Berkeley',
  timeZone: 'America/Los_Angeles',
  email: 'anetrhee@berkeley.edu',
  linkedin: 'https://www.linkedin.com/in/annetterhee/',
  taglineLead: 'A Designer & Storyteller',
  taglineRest: 'for brands, causes and communities that want to be heard.',
  intro:
    'Comparative Literature & Cognitive Science at UC Berkeley, Class of 2029. I design visual identities, campaigns and content that move people, and I study why they move.',
  bio: [
    'Annette Rhee is a designer and storyteller studying Comparative Literature and Cognitive Science at UC Berkeley, Class of 2029.',
    'She designs visual identities, campaigns and content that move people, and studies why they move.',
  ],
  year: 2026,
};

export const work: Work[] = [
  {
    slug: 'literature-diversified',
    org: 'Literature Diversified',
    orgLead: 'Literature',
    orgTail: 'Diversified',
    role: 'Director of Marketing',
    dates: 'Dec 2024 — Jun 2025',
    location: 'Los Angeles',
    line: 'Designed the visual identity, logo and campaign graphics.',
    stat: { value: 900, suffix: '+', label: 'Instagram followers' },
    tags: ['Brand Identity', 'Social', 'Campaigns'],
    bullets: [
      'Designed the visual identity, logo and campaign graphics.',
      'Grew Instagram to 900+ followers.',
      'Curriculum used across 760+ partner classrooms.',
    ],
    tone: '#ECC9C0',
  },
  {
    slug: 'cvusd',
    org: 'Conejo Valley USD Communications',
    orgLead: 'Conejo Valley',
    orgTail: 'USD',
    role: 'Student Intern',
    dates: 'Oct 2024 — May 2025',
    line: 'Weekly newsletters reaching 16,000+ students, parents and teachers.',
    stat: { value: 16000, suffix: '+', label: 'Readers each week' },
    tags: ['Editorial', 'Print', 'Public Campaigns'],
    bullets: [
      'Weekly newsletters reaching 16,000+ students, parents and teachers.',
      'Brochures and graphics for public health and school choice campaigns across 27 institutions.',
      'Built in Canva and Photoshop.',
    ],
    tone: '#E9C7A8',
  },
  {
    slug: 'uci-ethics',
    org: 'UC Irvine Ethics Center',
    orgLead: 'UC Irvine',
    orgTail: 'Ethics Center',
    role: 'Student Researcher',
    dates: 'Jul — Aug 2025',
    line: 'Research on the psychological and societal impact of rapid AI.',
    statText: { value: 'Helen Haste', label: 'Findings incorporated into her research' },
    tags: ['Research', 'Presentation'],
    bullets: [
      'Research on the psychological and societal impact of rapid AI.',
      'Explored the “seductions of certainty”.',
      'Findings incorporated into Helen Haste’s research.',
    ],
    tone: '#DCC4CA',
  },
  {
    slug: 'joy-to-all',
    org: 'Joy To All (JTA)',
    orgLead: 'Joy To',
    orgTail: 'All',
    role: 'Co-founder & Secretary',
    dates: 'Jun 2023 — Jun 2026',
    line: 'Support for troops in 30 countries and 100 shelter residents.',
    stat: { value: 50, suffix: '+', label: 'Volunteers' },
    tags: ['Community', 'Partnerships', 'Outreach'],
    bullets: [
      '50+ volunteers across 3 high school chapters.',
      '2 fundraisers a month.',
      'Support for troops in 30 countries and 100 shelter residents.',
    ],
    tone: '#EEDDB5',
  },
];

export const stats = [
  { value: 16000, suffix: '+', label: 'Reached' },
  { value: 760, suffix: '+', label: 'Classrooms' },
  { value: 1000, suffix: '+', label: 'Service hours' },
  { value: 900, suffix: '+', label: 'Followers' },
  { value: 27, suffix: '', label: 'Institutions' },
  { value: 50, suffix: '+', label: 'Volunteers' },
];

export const recognition = {
  award: { title: 'Congressional Award', medal: 'Gold Medal', date: 'Jan 2026' },
  japan: {
    title: 'Japan',
    kicker: '5-day independent research exploration',
    line: 'Post-WWII history, studied on the ground.',
    // Swap for '/assets/japan-1.jpg' when the photo is ready.
    image: undefined as string | undefined,
  },
};

export const education = {
  school: 'UC Berkeley',
  degrees: ['B.A. Comparative Literature', 'B.A. Cognitive Science'],
  expected: 'Expected May 2029',
  additional: ['Stanford Daily Multimedia Summer Program', 'Stanford Pre-Collegiate Summer Institutes'],
};

export const community = [
  {
    title: 'Congressional Award',
    meta: 'Gold Medal · Jan 2026',
    bullets: ['Congressional Award Gold Medal, Jan 2026.', '5-day independent research exploration of Japan (post-WWII history).'],
  },
  {
    title: 'Joy To All (JTA)',
    meta: 'Co-founder & Secretary · Jun 2023 — Jun 2026',
    bullets: [
      '50+ volunteers across 3 high school chapters.',
      '2 fundraisers a month.',
      'Support for troops in 30 countries and 100 shelter residents.',
    ],
  },
];

export const skills = {
  tools: ['Adobe Photoshop', 'After Effects', 'Figma', 'Canva', 'WordPress', 'Finalsite', 'Apple Logic Pro'],
  capabilities: ['UI/UX', 'Website Design', 'Market Research', 'Decking', 'Communication'],
  languages: ['English', 'Korean'],
  interests: [
    { name: 'Olympic Recurve Archery', short: 'Archery', tone: '#ECC9C0', image: undefined as string | undefined },
    { name: 'Creative & Opinion Writing', short: 'Writing', tone: '#DCC4CA', image: undefined as string | undefined },
    { name: 'Graphic Design', short: 'Design', tone: '#E9C7A8', image: undefined as string | undefined },
    { name: 'Music (Vocals, Guitar, Production)', short: 'Music', tone: '#EEDDB5', image: undefined as string | undefined },
  ],
};

export const marqueeTags = Array.from(new Set(work.flatMap((w) => w.tags)));
