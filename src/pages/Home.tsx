import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, List, Users, Zap } from 'lucide-react';
import { useAuth } from '../components/Auth/AuthProvider';
import { Button } from '../components/UI/Button';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: CheckCircle,
      title: 'Easy Task Management',
      description: 'Create, organize, and track your tasks with our intuitive interface.',
    },
    {
      icon: List,
      title: 'Multiple Lists',
      description: 'Organize your tasks into different lists for work, personal, and projects.',
    },
    {
      icon: Users,
      title: 'Secure & Private',
      description: 'Your data is protected with Google OAuth and stored securely in the cloud.',
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Access your tasks from anywhere with instant synchronization across devices.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Master Your{' '}
            <span className="text-yellow-400 relative">
              Tasks
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400 rounded-full"></div>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The ultimate to-do list app that helps you stay organized, focused, and productive. 
            Create lists, set priorities, and achieve your goals with ease.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="large" className="w-full sm:w-auto px-8 py-4">
                  Go to My Lists
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="large" className="w-full sm:w-auto px-8 py-4">
                  View Profile
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="large" className="w-full sm:w-auto px-8 py-4">
                  Sign in with Google
                </Button>
              </Link>
              <Button variant="outline" size="large" className="w-full sm:w-auto px-8 py-4">
                Learn More
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our powerful features make task management simple and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-yellow-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get organized?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users who have transformed their productivity with TodoMaster.
          </p>
          {!user && (
            <Link to="/login">
              <Button size="large" className="px-8 py-4">
                Get Started for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};