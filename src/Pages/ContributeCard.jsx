import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Calendar, Tag, MapPin, IndianRupee, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../Context/AuthContext';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPaymentOrder, getIssueById, verifyPaymentAndSaveContribution } from '../api/databaseService';
import Loading from './Loding';

const ContributeCard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getIssueById(id);
        setIssue(data);
      } catch (error) {
        console.error('Error fetching issue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const [formData, setFormData] = useState({
    contributorName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    amount: '',
    additionalInfo: '',
    purpose: 'For resolving this specific issue only',
    refundPreference: 'contact_me',
  });

  // Set default amount when issue loads
  useEffect(() => {
    if (issue) {
      setFormData(prev => ({ ...prev, amount: issue.amount || '' }));
    }
  }, [issue]);

  const today = new Date().toLocaleDateString();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpayCheckout = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    const amount = Number(formData.amount);
    const contributionData = {
      issueId: id,
      issueTitle: issue.title,
      amount,
      contributorName: formData.contributorName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      date: today,
      additionalInfo: formData.additionalInfo,
      purpose: formData.purpose,
      refundPreference: formData.refundPreference,
    };

    try {
      if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsPaying(false);
        return;
      }

      const isCheckoutLoaded = await loadRazorpayCheckout();
      if (!isCheckoutLoaded) {
        throw new Error('Unable to load Razorpay checkout');
      }

      const order = await createPaymentOrder({
        amount,
        issueId: id,
        issueTitle: issue.title,
      });

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Community Cleanliness',
        description: `Contribution for ${issue.title}`,
        order_id: order.orderId,
        prefill: {
          name: formData.contributorName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          issueId: id,
          issueTitle: issue.title,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay by UPI',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        theme: {
          color: '#2563eb',
        },
        handler: async (response) => {
          try {
            await verifyPaymentAndSaveContribution({
              ...response,
              contribution: contributionData,
            });
            toast.success('Payment successful. Your contribution is recorded as paid.', {
              position: 'top-right',
              autoClose: 3000,
            });
            setShowModal(false);
          } catch (error) {
            console.error(error);
            toast.error(error.message || 'Payment could not be verified with Razorpay', {
              position: 'top-right',
              autoClose: 3000,
            });
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast.info('Payment cancelled', {
              position: 'top-right',
              autoClose: 2000,
            });
          },
        },
      });

      checkout.open();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to start payment', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsPaying(false);
    }
  };

  if (isLoading || !issue) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 mt-16" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="p-4 sm:p-6">
        <title>ContributeCard | Community Cleanliness</title>

        {/* Title and Back Button Side by Side */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-semibold hover:underline cursor-pointer border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 mx-4" style={{ color: 'var(--text-color)' }}>
            Pay Cleanup Contribution
          </h1>
          
          {/* Empty div for balance */}
          <div className="w-[120px]"></div>
        </div>
        <div className="max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden transition hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 duration-500" style={{ backgroundColor: 'var(--bg-color)' }}>
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-56 sm:h-72 md:h-80 object-cover"
          />
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
              {issue.title}
            </h1>

            <div className="flex flex-wrap gap-3 text-sm sm:text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Tag size={16} className="text-blue-600 dark:text-blue-400" /> 
                <span className="font-medium text-blue-600 dark:text-blue-400">Category:</span> {issue.category}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-green-600 dark:text-green-400" /> 
                <span className="font-medium text-green-600 dark:text-green-400">Location:</span> {issue.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} className="text-blue-600 dark:text-blue-400" /> 
                <span className="font-medium text-blue-600 dark:text-blue-400">Date:</span> {issue.date}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee size={16} className="text-red-600 dark:text-red-400" /> 
                <span className="font-medium text-red-600 dark:text-red-400">Amount:</span> 
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{issue.amount}</span>
              </span>
            </div>

            <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
              {issue.description}
            </p>

            <div className="mb-6 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
              <h2 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Payment and transparency guarantee
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your real payment is processed through Razorpay and recorded against this issue only. The issue cannot be marked resolved until an after photo and receipt or bill are uploaded.
              </p>
            </div>

            <button
              onClick={() => {
                // Check if user is logged in
                if (!user) {
                  toast.info('Please login to make a contribution', {
                    position: 'top-right',
                    autoClose: 2000,
                  });
                  // Redirect to login page after a short delay
                  setTimeout(() => {
                    navigate('/signin');
                  }, 2000);
                  return;
                }
                
                // If user is logged in, show the contribution form
                toast.info('Opening contribution form...', {
                  position: 'top-right',
                  autoClose: 2000,
                });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white w-full sm:w-auto px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              Pay Clean-Up Contribution
            </button>
          </div>
        </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative animate-fadeIn border-2 border-gray-200 dark:border-gray-700" style={{ backgroundColor: 'var(--bg-color)' }}>
            <button
              onClick={() => {
                toast.warn('Contribution form closed', {
                  position: 'top-right',
                  autoClose: 2000,
                });
                setShowModal(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors duration-300"
            >
              <X size={22} />
            </button>

            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Pay Contribution
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                for "{issue.title}" — {issue.category}
              </p>
            </div>

            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4" style={{ backgroundColor: 'var(--bg-color)' }}>
              <img
                src={issue.image}
                alt={issue.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg" style={{ color: 'var(--text-color)' }}>
                  {issue.title}
                </h3>
                <p className="text-sm flex items-center justify-center sm:justify-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={14} className="text-green-600 dark:text-green-400" /> {issue.location}
                </p>
                <p className="text-sm flex items-center justify-center sm:justify-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar size={14} className="text-blue-600 dark:text-blue-400" /> {issue.date}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Contributor Name
                </label>
                <input
                  type="text"
                  name="contributorName"
                  value={formData.contributorName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Date
                </label>
                <input
                  type="text"
                  value={today}
                  disabled
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Additional Info (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any extra details..."
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  Contribution Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
                  If the issue is not resolved
                </label>
                <select
                  name="refundPreference"
                  value={formData.refundPreference}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                >
                  <option value="contact_me">Contact me before any action</option>
                  <option value="refund">Request refund</option>
                  <option value="reallocate">Reallocate to another verified issue</option>
                </select>
              </div>

              <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Verified Razorpay payments are recorded against this issue for transparency.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPaying ? 'Opening Payment...' : 'Pay with UPI / Razorpay'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
      </div>
    </div>
  );
};

export default ContributeCard;
