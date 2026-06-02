// import React from 'react';
// import { NavLink, useLoaderData } from 'react-router-dom';
// import { Calendar, MapPin, Tag, DollarSign } from 'lucide-react';
// import { Helmet } from 'react-helmet';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const IssueDetails = () => {
//   const issue = useLoaderData();

//   if (!issue) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-600">
//         <p>Loading issue details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-5 mt-14 px-6">
//       <title>IssueDetails| Community Cleanliness</title>

//       <div className="flex items-center justify-center  text-3xl md:text-4xl font-extrabold mb-6 text-blue-600 dark:text-blue-400 text-center">
//         your card details!
//       </div>

//       <div className="max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden border border-yellow-200 dark:border-gray-700">
//         <div className="relative">
//           <img
//             src={issue.image}
//             alt={issue.title}
//             className="w-full h-[500px] object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
//             <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
//               {issue.title}
//             </h1>
//           </div>
//         </div>

//         <div className="p-8 text-gray-800 dark:text-gray-200 space-y-5">
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div className="flex items-center gap-2 text-sm">
//               <Tag className="text-yellow-500" size={18} />
//               <span>
//                 <strong className="text-[#FFD700]">Category:</strong>{' '}
//                 {issue.category}
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-sm">
//               <MapPin className="text-green-500" size={18} />
//               <span>
//                 <strong className="text-[#FFD700]">Location:</strong>{' '}
//                 {issue.location}
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-sm">
//               <Calendar className="text-blue-500" size={18} />
//               <span>
//                 <strong className="text-[#FFD700]">Date:</strong>{' '}
//                 {issue.date || 'Not specified'}
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-sm">
//               <DollarSign className="text-red-500" size={18} />
//               <span>
//                 <strong className="text-[#FFD700]">Suggested Budget:</strong> $
//                 {issue.amount}
//               </span>
//             </div>
//           </div>

//           <hr className="border-t border-yellow-200 dark:border-gray-700" />

//           <div>
//             <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
//               Description
//             </h2>
//             <p className="leading-relaxed text-gray-700 dark:text-gray-300">
//               {issue.description}
//             </p>
//           </div>

//           <NavLink to={`/contributionss/${issue._id}`}>
//             <div className="pt-6 flex justify-center">
//               <button
//                 className="border border-[#FFD700] text-white px-4 py-1 rounded-full hover:bg-[#FFD700] hover:text-[#2E8B57] transition duration-300 cursor-pointer text-2xl font-bold"
//                 onClick={() =>
//                   toast.success('Thank you for your contribution!', {
//                     position: 'top-right',
//                     autoClose: 3000,
//                   })
//                 }
//               >
//                 💰 Contribute Now
//               </button>
//             </div>
//           </NavLink>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IssueDetails;
import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, DollarSign, ArrowLeft, Users } from 'lucide-react'; 
import { Helmet } from 'react-helmet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loding';
import { getIssueById, getIssueContributors } from '../api/databaseService';

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchIssueAndContributors = async () => {
      try {
        const issueData = await getIssueById(id);
        setIssue(issueData);
        
        const contributorsData = await getIssueContributors(id);
        setContributors(contributorsData || []);
      } catch (error) {
        console.error('Error fetching issue or contributors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssueAndContributors();
  }, [id]);

  if (isLoading || !issue) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
  <Loading/>
      </div>
    );
  }

  const totalContributed = contributors.reduce(
    (sum, contributor) => sum + (Number(contributor.amount) || 0),
    0
  );
  const progressUpdates = Array.isArray(issue.progressUpdates) ? issue.progressUpdates : [];
  const hasResolutionProof = Boolean(issue.afterImage && issue.receiptUrl);

  return (
    <div className="min-h-screen py-5 mt-14 px-6">
      <title>IssueDetails| Community Cleanliness</title>

      <div className="mb-4">
        <div className="max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-semibold hover:underline cursor-pointer border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center flex-1 mx-4" style={{ color: 'var(--text-color)' }}>
            Your card details!
          </h1>
          
          {/* Empty div for balance */}
          <div className="w-[120px]"></div>
        </div>
      </div>

      <div className="max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-500" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="relative">
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              {issue.title}
            </h1>
          </div>
        </div>

        <div className="p-8 space-y-5" style={{ color: 'var(--text-color)' }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="text-yellow-500" size={18} />
              <span className="text-[18px]">
                <strong className="text-blue-600 dark:text-blue-400">Category:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{issue.category}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-green-500" size={18} />
              <span className="text-[18px]">
                <strong className="text-green-600 dark:text-green-400">Location:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{issue.location}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-blue-500" size={18} />
              <span className="text-[18px]">
                <strong className="text-blue-600 dark:text-blue-400">Date:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{issue.date || 'Not specified'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="text-red-500" size={18} />
              <span className="text-[18px]">
                <strong className="text-red-600 dark:text-red-400">Suggested Budget:</strong>{' '}
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{issue.amount}</span>
              </span>
            </div>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              Description
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {issue.description}
            </p>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Transparency & Proof
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Issue-wise contributions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs. {totalContributed}</p>
              </div>
              <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Resolution proof</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {hasResolutionProof ? 'Uploaded' : 'Pending'}
                </p>
              </div>
              <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Verification</p>
                <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {issue.verificationStatus || 'not_submitted'}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                Refund or reallocation policy
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {issue.refundPolicy || 'Contributors may request a refund or reallocation if this issue is not resolved.'}
              </p>
            </div>

            {(issue.beforeImage || issue.afterImage || issue.receiptUrl) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {issue.beforeImage && (
                  <a href={issue.beforeImage} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={issue.beforeImage} alt="Before issue proof" className="h-40 w-full object-cover" />
                    <span className="block p-2 text-sm font-medium" style={{ color: 'var(--text-color)' }}>Before photo</span>
                  </a>
                )}
                {issue.afterImage && (
                  <a href={issue.afterImage} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={issue.afterImage} alt="After resolution proof" className="h-40 w-full object-cover" />
                    <span className="block p-2 text-sm font-medium" style={{ color: 'var(--text-color)' }}>After photo</span>
                  </a>
                )}
                {issue.receiptUrl && (
                  <a href={issue.receiptUrl} target="_blank" rel="noreferrer" className="flex min-h-40 flex-col justify-center rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Receipt / Bill</span>
                    <span className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {issue.receiptNote || 'Open uploaded spending proof'}
                    </span>
                  </a>
                )}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
                Progress updates
              </h3>
              {progressUpdates.length > 0 ? (
                <div className="space-y-3">
                  {progressUpdates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                        {update.date}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {update.note}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No progress updates have been posted yet.
                </p>
              )}
            </div>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Contributors Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Volunteers ({contributors.length})
              </h2>
            </div>
            {contributors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100">
                          {contributor.contributorName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contributor.email}
                        </p>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{contributor.amount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">Phone:</span> {contributor.phone}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">Location:</span> {contributor.address}
                    </p>
                    {contributor.additionalInfo && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{contributor.additionalInfo}"
                      </p>
                    )}
                    <div className="mt-3 rounded-md bg-white/70 dark:bg-gray-800/70 p-3 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Purpose:</span> {contributor.purpose || 'For resolving this specific issue only'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Fund status:</span> {contributor.fundStatus || 'recorded'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Refund preference:</span> {contributor.refundPreference || 'contact_me'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No volunteers yet. Be the first to contribute and help resolve this issue!
                </p>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />
          
          <NavLink to={`/contributionss/${issue.id}`}>
            <div className="pt-6 flex justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 text-xl"
                onClick={() =>
                  toast.success('Thank you for your contribution!', {
                    position: 'top-right',
                    autoClose: 3000,
                  })
                }
              >
                💰 Contribute Now
              </button>
            </div>
          </NavLink>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default IssueDetails;
