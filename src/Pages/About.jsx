import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiUsers, FiTarget, FiHeart, FiAward, FiTrendingUp, FiShield, FiArrowUp } from 'react-icons/fi';
import { MdRecycling, MdLocationCity, MdGroups } from 'react-icons/md';
import SlideOnScroll from './SlideOnScroll';

const About = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const stats = [
    { icon: <FiUsers size={40} />, number: '15,000+', label: 'Active Community Members' },
    { icon: <MdRecycling size={40} />, number: '2,500+', label: 'Issues Successfully Resolved' },
    { icon: <MdLocationCity size={40} />, number: '50+', label: 'Indian Cities and Towns' },
    { icon: <FiAward size={40} />, number: '98%', label: 'User Satisfaction Rate' }
  ];

  const values = [
    {
      icon: <FiHeart size={30} />,
      title: 'Community First',
      description: 'We believe in the power of community collaboration to create lasting positive change in neighborhoods.'
    },
    {
      icon: <FiShield size={30} />,
      title: 'Transparency',
      description: 'Every report, every action, and every outcome is tracked and visible to maintain complete transparency.'
    },
    {
      icon: <FiTarget size={30} />,
      title: 'Impact Focused',
      description: 'We measure success by the real-world improvements we help communities achieve together.'
    },
    {
      icon: <FiTrendingUp size={30} />,
      title: 'Continuous Growth',
      description: 'We constantly evolve our platform based on community feedback and emerging needs.'
    }
  ];

  const team = [
    {
      name: 'Vivekanand Tripathi',
      role: 'Project Holder & Lead Developer',
      image: 'https://i.ibb.co/2Z3p8wN/default-user.png',
      description: 'Creator and maintainer of this community platform. Built the application architecture and a fully independent backend structure.',
      email: 'vivektripathi3405@gmail.com',
      phone: '+91 7879539174',
      whatsapp: 'https://wa.me/917879539174',
    }
  ];

  return (
    <div className="pt-12">
      <Helmet>
        <title>About Us | Community Cleanliness & Issue Reporting Platform</title>
        <meta name="description" content="Learn about our mission to empower communities through collaborative issue reporting and resolution." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Our Mission
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            We're empowering every Indian community with the tools and voice to solve local problems and create positive change,
            one report at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/allissues">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition text-lg font-semibold">
                Join Our Community
              </button>
            </Link>
            <Link to="/allissues">
              <button className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition text-lg font-semibold">
                View Our Impact
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideOnScroll>
              <div>
                <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                  Our Story
                </h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  It started with a simple observation: communities have the power to solve their own problems, 
                  but they often lack the right tools and platforms to coordinate their efforts effectively.
                </p>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Founded in 2026, our platform was born from the belief that technology should serve Indian communities. 
                  We're dedicated to empowering citizens across India to take action on local issues and drive community-led development.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Today, we're proud to be the bridge between Indian communities and actionable solutions, 
                  helping neighbors across India connect, collaborate, and create lasting positive change in their localities.
                </p>
              </div>
            </SlideOnScroll>
            <SlideOnScroll>
              <div className="relative">
                <img
                  src="https://i.ibb.co.com/prZ7385V/Gemini-Generated-Image-qupsz6qupsz6qups.jpg"
                  alt="Community collaboration"
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/20 rounded-lg"></div>
              </div>
            </SlideOnScroll>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-color)' }}>
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <SlideOnScroll key={index}>
                <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600">
                  <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                    {stat.number}
                  </h3>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                </div>
              </SlideOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-color)' }}>
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <SlideOnScroll key={index}>
                <div className="flex items-start space-x-4 p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="text-blue-600 dark:text-blue-400 mt-1">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
                      {value.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </SlideOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-color)' }}>
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <SlideOnScroll key={index}>
                <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {member.description}
                  </p>
                  <div className="mt-4 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                      <a href={`mailto:${member.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {member.email}
                      </a>
                    </p>
                    <p>
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {member.phone}
                      </a>
                    </p>
                    <p>
                      <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">
                        WhatsApp
                      </a>
                    </p>
                  </div>
                </div>
              </SlideOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default About;