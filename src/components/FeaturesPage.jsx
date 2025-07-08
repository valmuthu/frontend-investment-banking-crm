// src/components/FeaturesPage.jsx
import { 
  Users, Calendar, Building2, TrendingUp, FileText, Target,
  MessageSquare, Phone, Mail, CheckCircle, BarChart3, Shield,
  Clock, Award, Zap, Globe, Smartphone, Chrome, Bell, Eye
} from 'lucide-react';

const FeaturesPage = ({ onShowLogin, onShowSignup }) => {
  const coreFeatures = [
    {
      icon: Users,
      title: "Smart Contact Management",
      description: "Organize your professional network with detailed contact profiles, interaction history, and relationship tracking.",
      features: [
        "Contact profiles with firm, position, and group details",
        "Networking status tracking (outreach, calls, follow-ups)",
        "Interaction logging with notes and sentiment analysis",
        "Referral tracking and connection mapping",
        "Smart tagging and categorization"
      ],
      image: "/api/placeholder/500/300"
    },
    {
      icon: Calendar,
      title: "Interview Pipeline Management",
      description: "Track every stage of your interview process from application to offer with detailed round management.",
      features: [
        "Multi-stage interview tracking",
        "Round-by-round notes and feedback",
        "Interview preparation reminders",
        "Outcome tracking and analytics",
        "Referral connection to contacts"
      ],
      image: "/api/placeholder/500/300"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Get insights into your networking effectiveness and interview success rates with powerful analytics.",
      features: [
        "Networking funnel visualization",
        "Interview conversion rates",
        "Success rate by firm and contact type",
        "Time-to-offer analytics",
        "Goal tracking and progress monitoring"
      ],
      image: "/api/placeholder/500/300"
    }
  ];

  const additionalFeatures = [
    {
      icon: Chrome,
      title: "Chrome Extension",
      description: "Seamlessly add contacts from LinkedIn and other professional sites directly to your CRM.",
      coming: false
    },
    {
      icon: Mail,
      title: "Email Integration",
      description: "Track email opens, clicks, and responses to optimize your outreach strategy.",
      coming: true
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get reminded about follow-ups, upcoming interviews, and important networking opportunities.",
      coming: false
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Access your network and interview data on-the-go with our mobile application.",
      coming: true
    },
    {
      icon: Globe,
      title: "Global Firm Database",
      description: "Access information about thousands of investment banks and consulting firms worldwide.",
      coming: false
    },
    {
      icon: Eye,
      title: "Application Tracking",
      description: "Monitor application statuses across multiple firms and positions simultaneously.",
      coming: false
    },
    {
      icon: FileText,
      title: "Document Templates",
      description: "Professional email templates, follow-up messages, and thank you notes.",
      coming: false
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security with encryption and secure data handling practices.",
      coming: false
    }
  ];

  const workflows = [
    {
      title: "Coffee Chat to Offer",
      steps: [
        "Log initial coffee chat interaction",
        "Set follow-up reminders",
        "Track referral to HR",
        "Manage interview rounds",
        "Celebrate your offer!"
      ]
    },
    {
      title: "Alumni Network Activation",
      steps: [
        "Import alumni contacts",
        "Track outreach campaigns",
        "Schedule networking calls",
        "Monitor response rates",
        "Convert to opportunities"
      ]
    },
    {
      title: "Campus Recruiting Prep",
      steps: [
        "Research target firms",
        "Track recruiting events",
        "Log recruiter interactions",
        "Prepare for interviews",
        "Follow up strategically"
      ]
    }
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
              <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</a>
              <a href="/features" className="text-primary-600 font-medium">Features</a>
              <a href="/additional-features" className="text-gray-600 hover:text-primary-600 transition-colors">Extensions</a>
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Powerful Tools for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Finance Success</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to build relationships, track opportunities, and land offers at top investment banks and consulting firms.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Platform Features</h2>
            <p className="text-xl text-gray-600">The essential tools every finance student needs</p>
          </div>

          {coreFeatures.map((feature, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Workflows</h2>
            <p className="text-xl text-gray-600">See how students use our platform to achieve their goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflows.map((workflow, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{workflow.title}</h3>
                <div className="space-y-4">
                  {workflow.steps.map((step, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Feature Set</h2>
            <p className="text-xl text-gray-600">Everything else you need for career success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 relative">
                {feature.coming && (
                  <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Data-Driven Career Decisions</h2>
              <p className="text-xl text-primary-100 mb-8">
                Make informed decisions about your networking strategy and interview preparation with powerful analytics and insights.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Real-time networking funnel analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Interview success rate tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Personalized improvement recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Benchmark against successful peers</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-primary-100">Success Rate</span>
                  <span className="text-2xl font-bold">87%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className="bg-green-400 h-3 rounded-full" style={{width: '87%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-primary-100 text-sm">Active Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-primary-100 text-sm">Interview Stages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who are using our platform to break into finance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onShowSignup}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Free Trial
            </button>
            <button 
              onClick={onShowLogin}
              className="btn-secondary text-lg px-8 py-4"
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
