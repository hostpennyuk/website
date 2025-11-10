// Simple client-side store using localStorage with sane defaults.
// In production, replace with a real backend (e.g., Supabase/Firebase/Hasura) and swap these adapters.

const KEY = {
  enquiries: 'hp_enquiries',
  testimonials: 'hp_testimonials',
  portfolio: 'hp_portfolio',
  emails: 'hp_emails',
  admin: 'hp_admin',
  settings: 'hp_settings',
  subscribers: 'hp_subscribers',
  users: 'hp_users',
  activity: 'hp_activity',
  seo: 'hp_seo',
  templates: 'hp_email_templates',
  signatures: 'hp_email_signatures',
  flags: 'hp_feature_flags',
  metrics: 'hp_metrics',
};

const safeParse = (val, fallback) => {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
};

export const crmStatuses = [
  'New',
  'Qualified',
  'In Progress',
  'Proposal Sent',
  'Closed Won',
  'Closed Lost',
  'On Hold',
];

export const projectCategories = [
  'Mobile Apps',
  'Websites',
  'UI/UX Design',
  'Web Apps',
  'Desktop Apps',
  'APIs & Backends',
  'eCommerce',
  'Games',
];

// SETTINGS
const defaultSettings = {
  hero: ['Turn', 'visitors to', 'customers'],
  heroMicrocopy: "Built for startups. Ready for scale.",
  primaryCtaLabel: 'Build my sales machine',
  stickyCtaLabel: "Let's Build Something Amazing",
  video: { youtubeId: 'Z3VopNZrkrs', startSeconds: 6 },
  logoUrl: 'https://hostpenny.co.uk/logo.gif',
  apiBaseUrl: '/api',
  // Optional endpoints to forward submissions to third-party services (Formspree, Getform, Web3Forms, custom API)
  formEndpoint: '',
  subscribeEndpoint: '',
  footer: {
    phone: '+44 7958 623678',
    email: 'hello@hostpenny.co.uk',
    address: '41 Rosedale Garden, Thatcham, RG19 3LE, England, United Kingdom',
  },
  social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
  calendlyUrl: '',
  slackWebhookUrl: '',
  theme: { gradient: 'brand' },
};

export const getSettings = () => safeParse(localStorage.getItem(KEY.settings), defaultSettings);
export const setSettings = (s) => localStorage.setItem(KEY.settings, JSON.stringify(s));

// --- API helpers (async with local fallback)
const getApiBase = () => {
  const base = (getSettings().apiBaseUrl || '').trim();
  return base || '';
};

async function apiFetch(path, options = {}) {
  const base = getApiBase();
  if (!base) throw new Error('API not configured');
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// FEATURE FLAGS
const defaultFlags = { enableVideoModal: true, enableStickyCta: true, heroVariant: 'A' };
export const getFeatureFlags = () => safeParse(localStorage.getItem(KEY.flags), defaultFlags);
export const setFeatureFlags = (flags) => localStorage.setItem(KEY.flags, JSON.stringify(flags));

// SEO per route
const defaultSeo = {
  '/': { title: 'HostPenny — Software that sells', description: 'Websites, apps, and platforms engineered for conversion and scale.' },
  '/services': { title: 'Services — HostPenny', description: 'Eight core offerings from product to platform.' },
  '/portfolio': { title: 'Portfolio — HostPenny', description: 'Browse projects by product category.' },
  '/about': { title: 'About — HostPenny', description: 'Who we are and how we ship.' },
  '/contact': { title: 'Contact — HostPenny', description: 'Start a project or ask a question.' },
};
export const getSeo = () => safeParse(localStorage.getItem(KEY.seo), defaultSeo);
export const setSeo = (seo) => localStorage.setItem(KEY.seo, JSON.stringify(seo));

// SUBSCRIBERS
export const getSubscribers = () => safeParse(localStorage.getItem(KEY.subscribers), []);
export const addSubscriber = (email) => {
  const list = getSubscribers();
  if (!list.find((s) => s.email.toLowerCase() === email.toLowerCase())) {
    list.unshift({ id: `${Date.now()}`, email, subscribedAt: new Date().toISOString() });
    localStorage.setItem(KEY.subscribers, JSON.stringify(list));
  }
};

export async function addSubscriberAsync(email, source) {
  try {
    const data = await apiFetch('/subscribers', { method: 'POST', body: JSON.stringify({ email, source }) });
    const list = await apiFetch('/subscribers', { method: 'GET' });
    localStorage.setItem(KEY.subscribers, JSON.stringify(list));
    return data;
  } catch {
    addSubscriber(email);
    return { email };
  }
}

// USERS (local only)
const defaultUsers = [{ id: 'u1', email: 'profmendel@gmail.com', role: 'Admin' }];
export const getUsers = () => safeParse(localStorage.getItem(KEY.users), defaultUsers);
export const setUsers = (users) => localStorage.setItem(KEY.users, JSON.stringify(users));

// ACTIVITY LOG
export const getActivity = () => safeParse(localStorage.getItem(KEY.activity), []);
export const addActivity = (action, meta = {}) => {
  const list = getActivity();
  list.unshift({ id: `${Date.now()}`, action, meta, at: new Date().toISOString() });
  localStorage.setItem(KEY.activity, JSON.stringify(list));
};

// METRICS (simple counters)
export const getMetrics = () => safeParse(localStorage.getItem(KEY.metrics), {});
export const incMetric = (name) => {
  const m = getMetrics();
  m[name] = (m[name] || 0) + 1;
  localStorage.setItem(KEY.metrics, JSON.stringify(m));
};

// Defaults (can be edited in Admin)
const defaultTestimonials = [
  { id: 't1', name: 'Linda Jhon', position: 'Managing Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', quote: 'Digital marketing can be very complex, but our team is here to help you through this process and get tangible results.' },
  { id: 't2', name: 'Katie Hanna', position: 'Leadership Team', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', quote: 'We work with exceptional companies and make it our mission to help them succeed.' },
  { id: 't3', name: 'Ronald Richard', position: 'Senior Consultant', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', quote: 'Equipped with all the skillsets to ship reliably.' },
];

const defaultPortfolio = [
  // Three per category (titles/images are placeholders)
  { id: 'm1', title: 'FitTrack Pro', category: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1590646299400-27b6b4c2a9a5?q=80&w=1200&auto=format&fit=crop', description: 'React Native fitness tracker with real-time metrics', featured: true },
  { id: 'm2', title: 'FoodDash', category: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1517242027094-631f8d1c68f2?q=80&w=1200&auto=format&fit=crop', description: 'On-demand delivery app with live courier tracking' },
  { id: 'm3', title: 'Budget Buddy', category: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop', description: 'Personal finance app with bank sync and insights' },

  { id: 'w1', title: 'SaaS Landing', category: 'Websites', image: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1200&auto=format&fit=crop', description: 'Conversion-first marketing site with SEO baked in', featured: true },
  { id: 'w2', title: 'DTC Storefront', category: 'Websites', image: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop', description: 'High-performance product storytelling and checkout' },
  { id: 'w3', title: 'Conference 2025', category: 'Websites', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', description: 'Beautiful event microsite with ticketing' },

  { id: 'u1', title: 'Fintech Dashboard', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop', description: 'Design system and components for enterprise UX', featured: true },
  { id: 'u2', title: 'Crypto Wallet', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop', description: 'Flows, prototypes, and user research' },
  { id: 'u3', title: 'Telehealth App', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200&auto=format&fit=crop', description: 'Patient-centric UX for remote care' },

  { id: 'wa1', title: 'Marketplace X', category: 'Web Apps', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop', description: 'Two-sided marketplace with Stripe Connect' },
  { id: 'wa2', title: 'Realtime Chat', category: 'Web Apps', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop', description: 'WebSockets, presence, and typing indicators' },
  { id: 'wa3', title: 'Analytics SaaS', category: 'Web Apps', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop', description: 'Multi-tenant dashboards at scale' },

  { id: 'd1', title: 'Media Studio', category: 'Desktop Apps', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', description: 'Electron-based editor with GPU acceleration' },
  { id: 'd2', title: 'Notes Pro', category: 'Desktop Apps', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop', description: 'Tauri app with offline-first sync' },
  { id: 'd3', title: 'Time Tracker', category: 'Desktop Apps', image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1200&auto=format&fit=crop', description: 'Native-feel productivity suite' },

  { id: 'a1', title: 'Payments API', category: 'APIs & Backends', image: 'https://images.unsplash.com/photo-1556157381-36f1b6a9f3f9?q=80&w=1200&auto=format&fit=crop', description: 'PCI-compliant payments and subscriptions' },
  { id: 'a2', title: 'Auth Service', category: 'APIs & Backends', image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop', description: 'SSO, MFA, and RBAC at scale' },
  { id: 'a3', title: 'Data Ingest', category: 'APIs & Backends', image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop', description: 'Stream processing and warehousing' },

  { id: 'e1', title: 'Headless Store', category: 'eCommerce', image: 'https://images.unsplash.com/photo-1515162305284-9cd0cb2a9f23?q=80&w=1200&auto=format&fit=crop', description: 'Next.js + Shopify hydrogen storefront' },
  { id: 'e2', title: 'Subscriptions', category: 'eCommerce', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', description: 'Recurring billing and customer portal' },
  { id: 'e3', title: 'Checkout UX', category: 'eCommerce', image: 'https://images.unsplash.com/photo-1511203466129-824e631920d4?q=80&w=1200&auto=format&fit=crop', description: 'Optimized conversion flows' },

  { id: 'g1', title: 'Runner Lite', category: 'Games', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', description: 'Casual endless runner for mobile' },
  { id: 'g2', title: 'Puzzle Grid', category: 'Games', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop', description: 'Relaxing brain teasers on web' },
  { id: 'g3', title: 'Arcade Tap', category: 'Games', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', description: 'One-tap arcade built with Phaser' },
];

// Enquiries
export const getEnquiries = () => safeParse(localStorage.getItem(KEY.enquiries), []);
export const addEnquiry = (enquiry) => {
  const list = getEnquiries();
  list.unshift(enquiry);
  localStorage.setItem(KEY.enquiries, JSON.stringify(list));
};
export const updateEnquiry = (id, patch) => {
  const list = getEnquiries().map((e) => (e.id === id ? { ...e, ...patch } : e));
  localStorage.setItem(KEY.enquiries, JSON.stringify(list));
};
export const deleteEnquiry = (id) => {
  const list = getEnquiries().filter((e) => e.id !== id);
  localStorage.setItem(KEY.enquiries, JSON.stringify(list));
};

// Async API-backed versions with graceful fallback to local storage
export async function getEnquiriesAsync() {
  try {
    const data = await apiFetch('/enquiries', { method: 'GET' });
    localStorage.setItem(KEY.enquiries, JSON.stringify(data));
    return data;
  } catch {
    return getEnquiries();
  }
}

export async function addEnquiryAsync(enquiry) {
  try {
    const data = await apiFetch('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) });
    return data;
  } catch {
    addEnquiry(enquiry);
    return enquiry;
  }
}

export async function updateEnquiryAsync(id, patch) {
  try {
    const data = await apiFetch(`/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    return data;
  } catch {
    updateEnquiry(id, patch);
    return getEnquiries().find((e) => e.id === id);
  }
}

export async function deleteEnquiryAsync(id) {
  try {
    await apiFetch(`/enquiries/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    deleteEnquiry(id);
    return true;
  }
}

// Testimonials
export const getTestimonials = () => safeParse(localStorage.getItem(KEY.testimonials), defaultTestimonials);
export const setTestimonials = (items) => localStorage.setItem(KEY.testimonials, JSON.stringify(items));

// Portfolio
export const getPortfolio = () => safeParse(localStorage.getItem(KEY.portfolio), defaultPortfolio);
export const setPortfolio = (items) => localStorage.setItem(KEY.portfolio, JSON.stringify(items));
export const getFeaturedPortfolio = (limit = 6) => getPortfolio().filter((p) => p.featured).slice(0, limit);

// Emails (outbox)
export const getEmails = () => safeParse(localStorage.getItem(KEY.emails), []);
export const addEmail = (email) => {
  const list = getEmails();
  list.unshift(email);
  localStorage.setItem(KEY.emails, JSON.stringify(list));
};

// Email templates
const defaultEmailTemplates = [
  { id: 'tpl1', name: 'Template 1', subject: 'Quick hello, {{firstName}}', body: 'Hi {{firstName}},\n\nI wanted to share a quick idea about {{topic}}. Would you be open to a short call this week?' },
  { id: 'tpl2', name: 'Template 2', subject: 'We can help you ship {{projectType}} fast', body: 'Hey {{firstName}},\n\nWe build {{projectType}} that turn visitors into customers. Here’s a quick plan for you:\n\n• Scope in days, not weeks\n• MVP in 2–4 weeks\n• Growth sprints thereafter' },
  { id: 'tpl3', name: 'Template 3', subject: 'Case study: from idea to launch', body: 'Hi {{firstName}},\n\nWe recently helped a team go from idea to launch in 21 days — increasing signups by 43%. I think a similar playbook could work for {{company}}.' },
  { id: 'tpl4', name: 'Template 4', subject: 'Free 30-minute teardown for {{company}}', body: 'Hi {{firstName}},\n\nWe’ll review your product funnel and send you 3 specific changes to boost conversions. No strings attached.' },
];
export const getEmailTemplates = () => safeParse(localStorage.getItem(KEY.templates), defaultEmailTemplates);
export const setEmailTemplates = (items) => localStorage.setItem(KEY.templates, JSON.stringify(items));
export const addEmailTemplate = (tpl) => setEmailTemplates([ { id: `${Date.now()}`, ...tpl }, ...getEmailTemplates() ]);
export const updateEmailTemplate = (id, patch) => setEmailTemplates(getEmailTemplates().map(t=>t.id===id?{...t,...patch}:t));
export const deleteEmailTemplate = (id) => setEmailTemplates(getEmailTemplates().filter(t=>t.id!==id));

// Email signatures
const defaultSignatures = [
  { id: 'sig1', name: 'Default', fullName: 'Your Name', designation: 'Founder, HostPenny', signature: 'Best regards,' },
  { id: 'sig2', name: 'Sales', fullName: 'Your Name', designation: 'Growth Lead', signature: 'Cheers,' },
  { id: 'sig3', name: 'Support', fullName: 'Your Name', designation: 'Customer Success', signature: 'Thanks,' },
];
export const getSignatures = () => safeParse(localStorage.getItem(KEY.signatures), defaultSignatures);
export const setSignatures = (items) => localStorage.setItem(KEY.signatures, JSON.stringify(items));

// Admin auth
export const getAdminSession = () => safeParse(localStorage.getItem(KEY.admin), null);
export const setAdminSession = (session) => localStorage.setItem(KEY.admin, JSON.stringify(session));
export const clearAdminSession = () => localStorage.removeItem(KEY.admin);

// BACKUP / RESTORE
export const exportAll = () => {
  const data = {};
  Object.values(KEY).forEach((k) => {
    data[k] = safeParse(localStorage.getItem(k), null);
  });
  return data;
};
export const importAll = (data) => {
  Object.entries(data || {}).forEach(([k, v]) => {
    if (typeof v !== 'undefined' && v !== null) {
      localStorage.setItem(k, JSON.stringify(v));
    }
  });
};
