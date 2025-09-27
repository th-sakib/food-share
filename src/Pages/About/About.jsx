import React from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Globe,
  Utensils,
  Share2,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-green-600" />,
      title: "Food Donation",
      description:
        "Easily donate surplus food items with photos, descriptions, and expiry details to help reduce waste.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community Network",
      description:
        "Connect food donors with people in need through a secure, user-friendly platform.",
    },
    {
      icon: <Share2 className="w-8 h-8 text-purple-600" />,
      title: "Smart Matching",
      description:
        "Advanced system to match available food with nearby recipients based on location and preferences.",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "Global Impact",
      description:
        "Join a worldwide movement to reduce food waste and fight hunger in local communities.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Sign Up",
      description:
        "Create your account and join our community of food sharers.",
      color: "text-green-600",
    },
    {
      step: "02",
      title: "Donate or Request",
      description:
        "Either donate surplus food or browse available items to request.",
      color: "text-blue-600",
    },
    {
      step: "03",
      title: "Connect",
      description:
        "Get matched with donors/recipients and arrange collection details.",
      color: "text-purple-600",
    },
    {
      step: "04",
      title: "Make Impact",
      description:
        "Complete the exchange and contribute to reducing food waste.",
      color: "text-orange-600",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Food Items Shared",
      icon: <Utensils className="w-6 h-6" />,
    },
    {
      number: "5K+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Cities Covered",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              <Heart className="w-4 h-4 mr-2" />
              About FoodShare
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Communities Through
            <span className="text-green-600 block mt-2">Food Sharing</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            FoodShare is a revolutionary platform that bridges the gap between
            food surplus and food need, creating stronger communities while
            reducing waste and fighting hunger.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/find-food")}
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
            >
              Start Exploring Food
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/donate-food")}
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              Donate Food
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                <span className="text-green-600 font-semibold text-lg">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Reducing Food Waste,
                <span className="text-green-600"> Building Community</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Every day, millions of pounds of perfectly good food go to waste
                while people in our communities go hungry. FoodShare exists to
                solve this problem by creating a seamless connection between
                those who have surplus food and those who need it.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Reduce food waste by up to 40% in participating communities
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Provide fresh, nutritious food to families in need
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Build stronger, more connected communities
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 text-center">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-center mb-2 text-green-600">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How FoodShare Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple four-step process makes food sharing easy, safe, and
              impactful for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
                  <div className={`text-4xl font-bold ${step.color} mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FoodShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make FoodShare the most trusted
              platform for community food sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at FoodShare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community First
              </h3>
              <p className="text-gray-600">
                We prioritize building strong, supportive communities where
                everyone can contribute and benefit.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sustainability
              </h3>
              <p className="text-gray-600">
                We're committed to reducing waste and promoting sustainable
                practices in food consumption.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Accessibility
              </h3>
              <p className="text-gray-600">
                We ensure our platform is easy to use and accessible to
                everyone, regardless of background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Have questions? Want to partner with us? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">hello@foodshare.com</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Community St, City, State</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of community members who are already making an
              impact through food sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8"
              >
                Join FoodShare Today
              </Button>
              <Button
                onClick={() => navigate("/find-food")}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8"
              >
                Browse Available Food
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
