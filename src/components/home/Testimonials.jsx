import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { getTestimonials } from '../../store/content';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(() => getTestimonials().filter(t=> t.published!==false));

  // Refresh from storage on mount (in case Admin updated it on another tab/session)
  useEffect(() => {
    setTestimonials(getTestimonials().filter(t=> t.published!==false));
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const letterSpacing = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.05, delay: index * 0.03 }}
        className="inline-block"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}>
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white font-semibold mb-2 tracking-wider uppercase text-sm"
          >
            What founders say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white"
          >
            <span className="block">{letterSpacing('Software that sells')}</span>
            <span className="block">{letterSpacing('and teams that care')}</span>
          </motion.h2>
        </div>

        {/* Client Images Row */}
        <div className="flex justify-center items-center space-x-4 mb-12 flex-wrap gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer transition-all duration-300 ${
                currentIndex === index ? 'ring-4 ring-primary rounded-full' : ''
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Testimonial Card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-12">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FaQuoteLeft className="text-white text-2xl" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
              {/* Client Image */}
              <motion.img
                key={testimonials[currentIndex].id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-white"
              />

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <motion.p
                  key={`quote-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-lg leading-relaxed mb-6 italic"
                >
                  " {testimonials[currentIndex].quote} "
                </motion.p>
                <motion.h4
                  key={`name-${currentIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-heading font-bold text-dark mb-1"
                >
                  {testimonials[currentIndex].name}
                </motion.h4>
                <motion.p
                  key={`position-${currentIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-primary font-semibold"
                >
                  {testimonials[currentIndex].position}
                </motion.p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <FaChevronLeft />
              </motion.button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index ? 'bg-primary w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
