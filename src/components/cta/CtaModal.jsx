import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useCtaModal } from './CtaContext';
import { addEnquiryAsync, crmStatuses, addActivity, getSettings } from '../../store/content';

// Country codes for phone input
const countryCodes = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+420', country: 'Czech Rep', flag: '🇨🇿' },
  { code: '+40', country: 'Romania', flag: '🇷🇴' },
].sort((a, b) => a.country.localeCompare(b.country));

const initialData = {
  fullName: '',
  email: '',
  company: '',
  countryCode: '+44',
  phone: '',
  projectType: 'Mobile App',
  idea: '',
  budget: 'Under $5k',
  timeline: 'ASAP',
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const Select = (props) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all bg-white"
  />
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white resize-y"
  />
);

const Success = () => (
  <div className="text-center py-10">
    <h3 className="text-2xl font-bold mb-2">Thank you! 🎉</h3>
    <p className="text-gray-700 mb-6">We received your details. Our team will contact you within 24 hours to schedule a quick discovery call.</p>
    <p className="text-sm text-gray-500">While you wait, feel free to explore our work and imagine what's next.</p>
  </div>
);

const CtaModal = () => {
  const { open, closeModal } = useCtaModal();
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setData(initialData);
        setSubmitting(false);
        setSuccess(false);
      }, 200);
    }
  }, [open]);

  const onChange = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Persist enquiry locally (can be swapped for API later)
    const now = new Date().toISOString();
    const enquiry = {
      id: `${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      status: crmStatuses[0],
      notes: '',
      tags: [],
      assignee: '',
      dueDate: '',
      links: [],
      spam: false,
      ...data,
    };
    try {
      const saved = await addEnquiryAsync(enquiry);
      if (saved && saved.id) {
        enquiry.id = saved.id;
      }
      addActivity('enquiry.created', { id: enquiry.id, email: enquiry.email });
      // Optional Slack notify if webhook present
      const { slackWebhookUrl, formEndpoint } = getSettings();
      if (slackWebhookUrl) {
        try {
          await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `🆕 New enquiry from ${enquiry.fullName} <${enquiry.email}> — ${enquiry.projectType} (${enquiry.budget}, ${enquiry.timeline})`,
            }),
          });
        } catch {}
      }
      // Optional forward to a central endpoint (e.g., Formspree, Getform, custom API)
      if (formEndpoint) {
        try {
          await fetch(formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...enquiry,
              source: window.location.href,
              userAgent: navigator.userAgent,
            }),
          });
        } catch {}
      }
    } catch (err) {
      // no-op: localStorage should not fail under normal conditions
      console.error('Failed saving enquiry', err);
    }
    // Simulate async UX
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden m-0 max-h-[92vh]"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 text-white">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest/relaxed text-white/80">Tell us what you're building — we'll make it real.</p>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight">Let's Build Something Amazing</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/90 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label="Close"
                >
                  <HiX size={24} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto max-h-[calc(92vh-70px)]">
              {!success ? (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" required>
                      <Input name="fullName" value={data.fullName} onChange={onChange} placeholder="Jane Founder" required />
                    </Field>
                    <Field label="Email" required>
                      <Input type="email" name="email" value={data.email} onChange={onChange} placeholder="jane@startup.com" required />
                    </Field>
                    <Field label="Phone Number" required>
                      <div className="flex gap-2">
                        <select
                          name="countryCode"
                          value={data.countryCode}
                          onChange={onChange}
                          className="w-28 px-2 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all bg-white text-sm"
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <Input 
                          type="tel" 
                          name="phone" 
                          value={data.phone} 
                          onChange={onChange} 
                          placeholder="7958 623678" 
                          required 
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                    </Field>
                    <Field label="Company / Startup Name">
                      <Input name="company" value={data.company} onChange={onChange} placeholder="Acme Labs" />
                    </Field>
                    <Field label="What do you want to build?" required>
                      <Select name="projectType" value={data.projectType} onChange={onChange}>
                        <option>Mobile App</option>
                        <option>Website</option>
                        <option>Desktop Application</option>
                        <option>Game Development</option>
                        <option>UI/UX Design</option>
                        <option>Other Software Project</option>
                      </Select>
                    </Field>
                    <Field label="Budget Range" required>
                      <Select name="budget" value={data.budget} onChange={onChange}>
                        <option>Under $5k</option>
                        <option>$5k–$20k</option>
                        <option>$20k–$50k</option>
                        <option>$50k+</option>
                      </Select>
                    </Field>
                    <Field label="Timeline" required>
                      <Select name="timeline" value={data.timeline} onChange={onChange}>
                        <option>ASAP</option>
                        <option>1–3 Months</option>
                        <option>3–6 Months</option>
                        <option>6+ Months</option>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Describe your idea / vision" required>
                    <Textarea name="idea" value={data.idea} onChange={onChange} rows={4} placeholder="Pitch it like you're talking to an investor. What's the problem? Who's it for? What's the win?" required />
                  </Field>

                  {/* Micro-copy */}
                  <div className="text-sm text-gray-500 -mt-1">Short is great. Bullet points are welcome. We’ll fill in the blanks together.</div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-semibold text-white shadow-xl transition-all disabled:opacity-80 disabled:cursor-not-allowed bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
                  >
                    {submitting ? 'Submitting…' : "Let's Build Something Amazing"}
                  </motion.button>

                  <p className="text-center text-xs text-gray-400">We’ll never share your info. No spam. No pressure.</p>
                </form>
              ) : (
                <Success />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CtaModal;
