// src/components/AdditionalFeaturesPage.jsx
import { 
  Building2, Chrome, Mail, Bell, Smartphone, Globe, 
  Eye, Shield, Zap, Download, Star, CheckCircle, 
  ArrowRight, Play, Calendar, FileText, Users,
  BarChart3, Target, Brain, Linkedin, MessageSquare,
  Clock, Workflow, Database, Link, ExternalLink
} from 'lucide-react';

const AdditionalFeaturesPage = ({ onShowLogin, onShowSignup }) => {
  const extensionsAndIntegrations = [
    {
      icon: Chrome,
      title: "Chrome Extension",
      subtitle: "One-click contact import",
      description: "Seamlessly add contacts from LinkedIn, AngelList, and other professional networks directly to your CRM with our powerful browser extension.",
      features: [
        "One-click LinkedIn profile import",
        "Automatic data extraction and formatting", 
        "Bulk contact import from company pages",
        "Smart duplicate detection",
        "Real-time sync with your CRM"
      ],
      status: "Available Now",
      statusColor: "bg-green-500",
      image: "/api/placeholder/600/400",
      comingSoon: false
    },
    {
      icon: Mail,
      title: "Email Integration",
      subtitle: "Advanced email tracking",
      description: "Track email opens, clicks, and responses to optimize your outreach strategy. Get insights into which messages work best.",
      features: [
        "Real-time email open tracking",
        "Click tracking for links",
        "Response rate analytics",
        "A/B testing for subject lines",
        "Automated follow-up sequences"
      ],
      status: "Coming Q2 2025",
      statusColor: "bg-amber-500",
      image: "/api/placeholder/600/400",
      comingSoon: true
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      subtitle: "Never miss an opportunity",
      description: "Get intelligent reminders about follow-ups, upcoming interviews, and networking opportunities at the perfect time.",
      features: [
        "Smart follow-up reminders",
        "Interview preparation alerts",
        "Networking event notifications",
        "Deadline tracking",
        "Custom notification rules"
      ],
      status: "Available Now",
      statusColor: "bg-green-500",
      image: "/api/placeholder/600/400",
      comingSoon: false
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      subtitle: "CRM on the go",
      description: "Access your network and interview data anywhere with our native mobile apps for iOS and Android.",
      features: [
        "Full CRM functionality on mobile",
        "Offline access to contacts",
        "Push notifications",
        "Voice memo recordings",
        "Location-based networking"
      ],
      status: "Beta Testing",
      statusColor: "bg-blue-500",
      image: "/api/placeholder/600/400",
      comingSoon: true
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations on networking strategy and interview preparation.",
      features: ["Smart contact recommendations", "Interview success predictions", "Optimal outreach timing"]
    },
    {
      icon: Globe,
      title: "Global Firm Database",
      description: "Access comprehensive information about investment banks and consulting firms worldwide.",
      features: ["10,000+ firm profiles", "Contact directories", "Recent deal information"]
    },
    {
      icon: Eye,
      title: "Application Tracking",
      description: "Monitor application statuses across multiple firms simultaneously.",
      features: ["Real-time status updates", "Application deadline tracking", "Success rate analytics"]
    },
    {
      icon: FileText,
      title: "Document Templates",
      description: "Professional templates for emails, cover letters, and thank you notes.",
      features: ["50+ professional templates", "Customizable content", "Industry-specific formats"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your networking performance and interview success rates.",
      features: ["Conversion funnel analysis", "Response rate tracking", "ROI on networking activities"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with encryption and compliance features.",
      features: ["End-to-end encryption", "SOC 2 compliance", "Data residency options"]
    },
    {
      icon: Workflow,
      title: "Automation Workflows",
      description: "Automate repetitive tasks and streamline your networking process.",
      features: ["Custom workflow builder", "Automated follow-up sequences", "Task automation"]
    },
    {
      icon: Database,
      title: "CRM Integrations",
      description: "Sync with popular CRM platforms and productivity tools.",
      features: ["Salesforce integration", "HubSpot connectivity", "Google Workspace sync"]
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly integrate with your calendar for meeting management.",
      features: ["Two-way calendar sync", "Meeting preparation notes", "Automatic follow-up creation"]
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Investment Banking Analyst at Deutsche Bank",
      content: "The Chrome extension saved me hours of manual data entry. I imported 50+ LinkedIn contacts in minutes.",
      rating: 5,
      feature: "Chrome Extension"
    },
    {
      name: "Maria Garcia",
      role: "Consulting Associate at McKinsey",
      content: "Email tracking helped me optimize my outreach. My response rate improved by 40% after using the insights.",
      rating: 5,
      feature: "Email Integration"
    },
    {
      name: "David Kim",
      role: "Private Equity Analyst at Blackstone",
      content: "Smart notifications ensure I never miss important follow-ups. It's like having a personal assistant.",
      rating: 5,
      feature: "Smart Notifications"
    }
  ];

  const integrationPartners = [
    { name: "LinkedIn", logo: "/api/placeholder/120/60" },
    { name: "Gmail", logo: "/api/placeholder/120/60" },
    { name: "Outlook", logo: "/api/placeholder/120/60" },
    { name: "Salesforce", logo: "/api/placeholder/120/60" },
    { name: "HubSpot", logo: "/api/placeholder/120/60" },
    { name: "Slack", logo: "/api/placeholder/120/60" }
  ];

  const FeatureCard = ({ feature, isDetailed = false }) => (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${
      isDetailed ? 'p-8' : 'p-6'
    }`}>
      <div className={`w-12 h-12 ${feature.comingSoon ? 'bg-amber-100' : 'bg-primary-100'} rounded-lg flex items-center justify-center mb-6`}>
        <feature.icon className={`w-6 h-6 ${feature.comingSoon ? 'text-amber-600' : 'text-primary-600'}`} />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
        {isDetailed && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${feature.statusColor}`}>
            {feature.status}
          </span>
        )}
      </div>
      
      {feature.subtitle && (
        <p className="text-primary-600 font-medium mb-3">{feature.subtitle}</p>
      )}
      
      <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
      
      <ul className="space-y-3">
        {feature.features.map((item, i) => (
          <li key={i} className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
      
      {isDetailed && feature.comingSoon && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-amber-600 mr-2" />
            <span className="text-amber-800 text-sm font-medium">Coming Soon - Join the waitlist to get early access!</span>
          </div>
        </div>
      )}
    </div>
  );

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
              <a href="/features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="/additional-features" className="text-primary-600 font-medium">Extensions</a>
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
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Extensions & Integrations
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Supercharge Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Networking</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced tools and integrations that automate your workflow, provide deeper insights, 
            and help you build relationships more effectively than ever before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onShowSignup}
              className="btn-primary text-lg px-8 py-4"
            >
              Try Extensions Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button className="btn-secondary text-lg px-8 py-4">
              <Download className="w-5 h-5 mr-2" />
              Download Chrome Extension
            </button>
          </div>
        </div>
      </section>

      {/* Main Extensions/Integrations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Extensions & Integrations</h2>
            <p className="text-xl text-gray-600">Powerful tools that integrate seamlessly with your workflow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {extensionsAndIntegrations.map((feature, index) => (
              <FeatureCard key={index} feature={feature} isDetailed={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600">Connect with the tools you already use</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {integrationPartners.map((partner, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-12 object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-xl text-gray-600">Everything else you need for career success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Spotlight - Chrome Extension */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                <Chrome className="w-4 h-4 mr-2" />
                Most Popular Extension
              </div>
              
              <h2 className="text-4xl font-bold mb-6">Chrome Extension in Action</h2>
              <p className="text-xl text-primary-100 mb-8">
                See how easy it is to import LinkedIn profiles and build your network 
                with just one click. No more manual data entry.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Import LinkedIn profiles in seconds</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Automatic data formatting and cleanup</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Works on company pages and search results</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>Smart duplicate detection</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Add to Chrome - Free
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-6 py-3 rounded-lg transition-colors">
                  <Play className="w-4 h-4 mr-2 inline" />
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Chrome className="w-8 h-8 text-blue-500" />
                  <span className="text-sm text-gray-500">IB CRM Extension</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      JS
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John Smith</p>
                      <p className="text-sm text-gray-600">VP at Goldman Sachs</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      SK
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah Kim</p>
                      <p className="text-sm text-gray-600">Director at JPMorgan</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-green-600">47 contacts</span> imported successfully
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
            <p className="text-xl text-gray-600">Real feedback from finance professionals</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    {testimonial.feature}
                  </span>
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
            Ready to Supercharge Your Networking?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get access to all extensions and advanced features with your free trial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onShowSignup}
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Start Free Trial
            </button>
            <button 
              onClick={onShowLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-primary-200 mt-4">
            All extensions included • No setup required • Cancel anytime
          </p>
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
                Advanced tools and extensions for finance professionals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Extensions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Chrome Extension</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Notifications</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Integrations</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gmail</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salesforce</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Calendar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IB CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdditionalFeaturesPage;
