import Link from 'next/link';
import { CheckCircle2, Users, Zap, Shield, BarChart3, Clock, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Free & Open Source
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Tasks Like a
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Pro</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              The all-in-one task management platform that helps teams collaborate, 
              track progress, and deliver projects on time. Simple, powerful, and beautiful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-semibold text-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Open Source
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Tasks', value: '124', color: 'blue' },
                    { label: 'Completed', value: '89', color: 'green' },
                    { label: 'In Progress', value: '28', color: 'yellow' },
                    { label: 'Overdue', value: '7', color: 'red' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Work together seamlessly with role-based access control and real-time updates.',
                color: 'blue',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Built with modern tech for instant loading and smooth interactions.',
                color: 'yellow',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with row-level access control and encryption.',
                color: 'green',
              },
              {
                icon: BarChart3,
                title: 'Powerful Analytics',
                description: 'Track progress with real-time dashboards and insightful metrics.',
                color: 'purple',
              },
              {
                icon: Clock,
                title: 'Smart Deadlines',
                description: 'Never miss a deadline with automatic reminders and overdue tracking.',
                color: 'red',
              },
              {
                icon: CheckCircle2,
                title: 'Easy to Use',
                description: 'Intuitive interface that your team will love from day one.',
                color: 'blue',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of teams already using TaskFlow to manage their projects.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-semibold text-lg"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-blue-100">
              No credit card required • Free forever • Get started in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>
          <p className="text-sm">
            © 2024 TaskFlow. All rights reserved. Built with ❤️ for productive teams.
          </p>
        </div>
      </footer>
    </div>
  );
}
