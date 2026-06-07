import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiCalendar, FiMail, FiMapPin, FiPhone, FiSearch, FiUsers } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMembers } from '../api/authService';
import { resolveMediaUrl } from '../utils/mediaUrl';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const memberList = await getMembers();
        setMembers(memberList || []);
      } catch (error) {
        toast.error(error.message || 'Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return members;

    return members.filter((member) => {
      const values = [
        member.displayName,
        member.email,
        member.phoneNumber,
        member.location,
      ];

      return values.some((value) =>
        String(value || '').toLowerCase().includes(normalizedSearch)
      );
    });
  }, [members, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitial = (member) =>
    (member.displayName || member.email || 'M').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pt-28 pb-12 px-4" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Helmet>
        <title>Members | Community Cleanliness Platform</title>
        <meta name="description" content="View registered community members and their details" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mb-4">
                <FiUsers size={18} />
                <span className="text-sm font-semibold">{members.length} signed-up members</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                Community Members
              </h1>
              <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                See people who joined the application after signing up, along with the profile details they have shared.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search members"
                className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            Loading members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-10 text-center" style={{ color: 'var(--text-secondary)' }}>
            No members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <motion.article
                key={member.uid}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                style={{ backgroundColor: 'var(--bg-color)' }}
              >
                <div className="h-3 bg-gradient-to-r from-green-500 via-blue-500 to-yellow-400"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {member.photoURL ? (
                      <img
                        src={resolveMediaUrl(member.photoURL)}
                        alt={member.displayName || member.email}
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-200 dark:border-green-800 bg-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
                        {getInitial(member)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-color)' }}>
                          {member.displayName || 'Unnamed Member'}
                        </h2>
                        {member.emailVerified && (
                          <MdVerified className="text-blue-500 flex-shrink-0" size={20} title="Verified account" />
                        )}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Joined {formatDate(member.metadata?.creationTime)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <FiMail className="text-green-600 flex-shrink-0" size={17} />
                      <span className="truncate" style={{ color: 'var(--text-color)' }}>
                        {member.email || 'Email not provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FiPhone className="text-blue-600 flex-shrink-0" size={17} />
                      <span style={{ color: 'var(--text-color)' }}>
                        {member.phoneNumber || 'Phone not provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FiMapPin className="text-orange-600 flex-shrink-0" size={17} />
                      <span className="truncate" style={{ color: 'var(--text-color)' }}>
                        {member.location || 'Location not provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FiCalendar className="text-purple-600 flex-shrink-0" size={17} />
                      <span style={{ color: 'var(--text-color)' }}>
                        Last active {formatDate(member.metadata?.lastSignInTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
