import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chrome, List, ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/Auth/AuthProvider';
import { Button } from '../components/UI/Button';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

export const Login: React.FC = () => {
  const { signInWithGoogle, user, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-black transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        {/* Logo and Title */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <List size={32} className="text-yellow-400" />
            <span className="text-2xl font-bold text-black">TodoMaster</span>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-black">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Get organized and boost your productivity
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg border-2 border-gray-200 sm:px-10">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-md p-4">
                <p className="text-sm text-red-700">
                  Authentication failed. Please try again.
                </p>
              </div>
            )}

            {/* Google Sign In Button */}
            <div>
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                size="large"
                className="w-full flex items-center justify-center space-x-3 py-3"
                loading={loading}
              >
                <Chrome size={20} />
                <span>Continue with Google</span>
              </Button>
            </div>

            {/* Benefits */}
            <div className="mt-8 space-y-3">
              <p className="text-sm text-gray-600 text-center font-medium">Why choose TodoMaster?</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Secure Google OAuth authentication
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Real-time sync across all devices
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Beautiful, intuitive interface
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Completely free to use
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our terms of service and privacy policy.
            Your data is encrypted and securely stored.
          </p>
        </div>
      </div>
    </div>
  );
};