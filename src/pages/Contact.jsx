import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import SEO from '../components/SEO';
import { addEnquiryAsync, crmStatuses, addActivity } from '../store/content';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      const enquiry = {
        id: `${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        fullName: formData.name,
        email: formData.email,
        company: '',
        projectType: formData.subject,
        idea: formData.message,
        budget: 'Not specified',
        timeline: 'Not specified',
        status: crmStatuses[0],
        notes: formData.phone ? `Phone: ${formData.phone}` : '',
        tags: ['Contact Form'],
        assignee: '',
        dueDate: '',
        links: [],
        spam: false,
      };
      
      const saved = await addEnquiryAsync(enquiry);
      if (saved && saved.id) {
        enquiry.id = saved.id;
      }
      addActivity('contact.form.submitted', { id: enquiry.id, email: enquiry.email });
      
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to submit contact form', err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+44 7958 623678'],
      color: 'from-primary to-orange-600',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['hello@hostpenny.co.uk'],
      color: 'from-secondary to-accent',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['41 Rosedale Garden, Thatcham,', 'RG19 3LE, England, United Kingdom'],
      color: 'from-orange-600 to-primary',
    },
  ];

  return (
    <div className="pt-24">
      <SEO 
        title="Contact — Start your project | HostPenny"
        description="Tell us what you’re building — we’ll make it real. Get in touch for a fast, friendly discovery call within 24 hours."
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ background: 'radial-gradient(circle, rgba(255,87,34,0.2) 0%, transparent 70%)' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-semibold mb-4 tracking-wider uppercase"
            >
              Get In Touch
            </motion.p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-dark mb-6">
              Tell us what you’re building—
              <span className="block text-gradient">we’ll make it real</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Fill the short form. We’ll reply within 24 hours with next steps—and a plan to turn visitors into customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-6 shadow-lg mx-auto`}
                  >
                    <info.icon className="text-white text-3xl" />
                  </motion.div>
                  <h3 className="text-2xl font-heading font-bold text-dark mb-4">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
                Let's Start a
                <span className="block text-gradient">Conversation</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Whether you have a question about our services, pricing, or anything else, 
                our team is ready to answer all your questions.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Fill out the form and we'll get back to you within 24 hours. We're looking 
                forward to hearing from you!
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {['Quick response time', 'Dedicated support team', 'Free consultation', 'No obligations'].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submitting || success}
                    whileHover={{ scale: submitting || success ? 1 : 1.02 }}
                    whileTap={{ scale: submitting || success ? 1 : 0.98 }}
                    className={`w-full py-4 text-lg flex items-center justify-center space-x-2 transition-all ${
                      success 
                        ? 'bg-green-600 text-white' 
                        : submitting 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'btn-primary'
                    }`}
                  >
                    <span>
                      {success ? '✓ Message Sent!' : submitting ? 'Sending...' : 'Submit Now'}
                    </span>
                    {!success && !submitting && <FaPaperPlane />}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-0">
        <div className="w-full h-96 bg-gray-300 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FaMapMarkerAlt className="text-6xl text-primary mb-4 mx-auto" />
              <p className="text-xl font-semibold text-gray-700">Map Integration</p>
              <p className="text-gray-600">Add your Google Maps embed here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
