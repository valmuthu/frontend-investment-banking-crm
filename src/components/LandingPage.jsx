// src/components/LandingPage.jsx
import { useState } from 'react';
import { 
  Building2, Users, Calendar, TrendingUp, CheckCircle, Star,
  ArrowRight, Play, BarChart3, Target, Mail, FileText,
  Shield, Zap, Globe, Phone
} from 'lucide-react';

const LandingPage = ({ onShowLogin, onShowSignup }) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Smart Networking",
      description: "Track every interaction, manage follow-ups, and build meaningful relationships with industry professionals."
    },
    {
      icon: Calendar,
      title: "Interview Pipeline",
      description: "Organize your interview process from application to offer with detailed round tracking and preparation notes."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Visualize your networking success, interview conversion rates, and identify areas for improvement."
    },
    {
      icon: Target,
      title: "Goal Management",
      description: "Set networking targets, track your progress, and stay motivated with achievement milestones."
    },
    {
      icon: FileText,
      title: "Document Hub",
      description: "Store resumes, cover letters, and templates in one organized location with version control."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your career data is protected with enterprise-grade security and privacy controls."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Investment Banking Analyst at Goldman Sachs",
      content: "This CRM helped me land my dream job at Goldman. The networking tracker was a game-changer for managing 50+ industry contacts.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Private Equity Associate at KKR",
      content: "The interview pipeline feature kept me organized through 12 different processes. I never missed a follow-up again.",
      rating: 5
    },
    {
      name: "Emily Park",
      role: "Corporate Development at JPMorgan",
      content: "The analytics showed me exactly where I needed to improve. My interview success rate doubled after using this platform.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Placed" },
    { number: "500+", label: "Partner Firms" },
    { number: "95%", label: "Success Rate" },
    { number: "2M+", label: "Connections Made" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center mr-3 shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">IB CRM</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Success Stories</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={onShowLogin}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={onShowSignup}
                className="btn-primary"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Trusted by 10,000+ Finance Students
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Land Your Dream
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Finance Job</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The all-in-one CRM platform that helps finance students organize networking, 
                track interviews, and land offers at top investment banks and consulting firms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={onShowSignup}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <button 
                  onClick={() => setVideoPlaying(true)}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Free 14-day trial • No credit card required
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-1 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="IB CRM Dashboard"
                  className="w-full rounded-xl"
                />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">23 Active Applications</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">85% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From networking to offers, our platform handles every step of your finance career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your finance career prospects
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Import Your Network</h3>
              <p className="text-gray-600">Upload your existing contacts or start fresh. Our platform helps you organize everyone from LinkedIn connections to alumni contacts.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Every Interaction</h3>
              <p className="text-gray-600">Log coffee chats, emails, and phone calls. Set follow-up reminders and never let a connection go cold again.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Land Your Offer</h3>
              <p className="text-gray-600">Manage interviews, track applications, and use our analytics to optimize your approach until you get that dream offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how our platform helped students land their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who've used our platform to break into finance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onShowSignup}
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Start Your Free Trial
            </button>
            <button 
              onClick={onShowLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 gradient-blue rounded-lg flex items-center justify-center mr-2">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">IB CRM</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The platform that helps finance students build careers and land offers at top firms.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IB CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {videoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Product Demo</h3>
              <button 
                onClick={() => setVideoPlaying(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Demo video would play here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
