import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../Context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SignUp = () => {
  const navigate = useNavigate();
  const { createUser, googleSignIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = () => setShow(!show);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfileImage(null);
      setImagePreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be smaller than 5 MB.');
      e.target.value = '';
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const terms = e.target.terms.checked;
    const firstNameValue = firstName.trim();
    const emailValue = email.trim();
    const passwordValue = passcode.trim();

    if (!terms) {
      toast.error('Please accept our terms and conditions.');
      return;
    }
    if (!profileImage) {
      toast.error('Please upload a profile image.');
      return;
    }
    if (passwordValue.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Z]/.test(passwordValue)) {
      toast.error('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(passwordValue)) {
      toast.error('Password must include at least one number.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
      toast.error(
        'Password must include at least one special character (e.g., # or % ).'
      );
      return;
    }

    setIsSubmitting(true);

    createUser(emailValue, passwordValue, firstNameValue, profileImage)
      .then(() => {
        e.target.reset();
        setEmail('');
        setPasscode('');
        setFirstName('');
        setProfileImage(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview('');
        setSuccess(true);
        toast.success('Registration successful!');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    googleSignIn(credentialResponse.credential)
      .then(() => {
        toast.success('Google Sign Up successful!');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 via-green-50 to-green-200 px-4 relative pt-20 pb-10">
      <Helmet>
        <title>Singup | Community Cleanliness</title>
      </Helmet>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-[#2E8B57] shadow-2xl rounded-3xl p-10 w-full max-w-md border border-[#FFD700]">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-white mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white text-[#2E8B57] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white mb-2">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 bg-white text-[#2E8B57] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2E8B57] file:text-white file:cursor-pointer"
            />
            <p className="text-[#FFDAB9] text-xs mt-2">
              Upload JPG, PNG, or GIF (max 5 MB)
            </p>
            {imagePreview && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#FFD700]"
                />
                <p className="text-white text-sm mt-2">{profileImage?.name}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white text-[#2E8B57] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
            />
          </div>

          <div className="relative flex flex-col">
            <label className="text-white mb-2">Password</label>
            <input
              type={show ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white text-[#2E8B57] border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:outline-none pr-12 transition"
            />
            <button
              type="button"
              onClick={handleToggle}
              className="absolute mt-14 right-4 -translate-y-1/2 text-[#2E8B57] hover:text-[#FFD700]"
            >
              {show ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="terms" id="terms" />
            <label htmlFor="terms" className="text-white text-sm">
              Accept our{' '}
              <span className="text-[#FFD700]">terms and conditions</span>
            </label>
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && (
            <p className="text-green-300 text-sm">Registration successful!</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 border border-[#FFD700] bg-transparent text-white font-bold rounded-xl hover:bg-[#FFD700] hover:text-[#2E8B57] transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {googleClientId && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-[#FFD700]"></div>
              <span className="px-3 text-[#FFD700] text-sm">or</span>
              <div className="flex-grow h-px bg-[#FFD700]"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign in failed')}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </>
        )}

        {!googleClientId && (
          <p className="text-center text-[#FFDAB9] text-sm mt-6 flex items-center justify-center gap-2">
            <FcGoogle className="w-5 h-5" />
            Google sign-in requires VITE_GOOGLE_CLIENT_ID
          </p>
        )}

        <p className="text-sm text-center text-white mt-6">
          Already have an account?{' '}
          <NavLink to="/signin" className="text-[#FFD700] hover:underline">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
