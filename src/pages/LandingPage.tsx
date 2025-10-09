import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Code, 
  Coffee, 
  Terminal, 
  Brain, 
  Globe, 
  BarChart3, 
  Star,
  ArrowRight,
  Users,
  Award,
  MessageCircle,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Rocket,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Computer Science & Technology",
      description: "Learn core programming concepts, data structures, and system design.",
      tag: "+5 Years Teaching Experience"
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Java Programming",
      description: "Master OOP concepts, Spring Boot, and backend development with real-world projects.",
      tag: "+5 Years Teaching Experience"
    },
    {
      icon: <Terminal className="h-8 w-8" />,
      title: "Python",
      description: "From basics to data analysis, automation, and AI applications.",
      tag: "+5 Years Teaching Experience"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Machine Learning",
      description: "Learn regression, classification, model evaluation, and deployment using Python & TensorFlow.",
      tag: "+5 Years Teaching Experience"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Development (MERN Stack)",
      description: "Build modern web apps using MongoDB, Express, React, and Node.js.",
      tag: "+5 Years Teaching Experience"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Data Analytics & Power BI",
      description: "Transform raw data into actionable insights with visualization tools.",
      tag: "+5 Years Teaching Experience"
    }
  ];

  const tutors = [
    {
      name: "Dr. Sarah Johnson",
      specialization: "Java & Machine Learning",
      experience: "10+ Years in Java & ML Tutoring",
      avatar: "SJ",
      quote: "Learn from Industry Professionals who've trained 500+ students."
    },
    {
      name: "Prof. Michael Chen",
      specialization: "Python & Data Science",
      experience: "8+ Years in Python & Data Analytics",
      avatar: "MC",
      quote: "Expert guidance for real-world applications."
    },
    {
      name: "Dr. Emily Rodriguez",
      specialization: "Web Development & Full Stack",
      experience: "12+ Years in Web Development",
      avatar: "ER",
      quote: "Building tomorrow's web applications today."
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Computer Science Student",
      content: "The Java tutoring sessions transformed my understanding of OOP concepts. Highly recommended!",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Data Science Enthusiast",
      content: "Excellent Python guidance with real-world projects. The ML course was outstanding!",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Web Developer",
      content: "The MERN stack course helped me land my dream job. The tutors are industry experts!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-indigo-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TutorDash
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/auth")} className="hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300">
                Login
              </Button>
              <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            {/* Floating Icons */}
            <div className="absolute top-10 left-10 animate-bounce delay-100">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="absolute top-20 right-20 animate-bounce delay-300">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="absolute bottom-20 left-20 animate-bounce delay-500">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="absolute bottom-10 right-10 animate-bounce delay-700">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Rocket className="h-6 w-6 text-purple-500" />
              </div>
            </div>

            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Learners with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                  Expert Tutoring
                </span>{" "}
                & Project Support
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Get personalized tutoring, project guidance, and academic mentoring from industry experts. 
                We bridge the gap between learning and practical implementation.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group" 
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group" 
                  onClick={() => navigate("/auth")}
                >
                  <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Book a Session
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                  <div className="text-gray-600">Students Trained</div>
                </div>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-pink-600 mb-2">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-purple-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4" />
              About Our Platform
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              About Us / What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              We provide personalized tutoring, project guidance, and academic mentoring by experts. 
              Our sessions are available for both beginners and advanced learners, ensuring everyone 
              can achieve their learning goals.
            </p>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
              <p className="text-xl font-semibold italic">
                "We bridge the gap between learning and practical implementation."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Teach Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Our Courses
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Teach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive courses designed by industry experts with real-world applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl w-fit group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300 group-hover:scale-110">
                    <div className="text-indigo-600 group-hover:text-purple-600 transition-colors">
                      {subject.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {subject.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {subject.description}
                  </CardDescription>
                  <Badge variant="secondary" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 hover:from-indigo-200 hover:to-purple-200 transition-all duration-300">
                    {subject.tag}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Tutors Section */}
      <section className="py-20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/15 to-purple-100/15"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Expert Team
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Expert Tutors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from Industry Professionals who've trained 500+ students with proven success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map((tutor, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 group">
                <CardHeader className="pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="mx-auto h-24 w-24 ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-800 text-2xl font-bold">
                        {tutor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {tutor.name}
                  </CardTitle>
                  <CardDescription className="text-indigo-600 font-medium text-lg">
                    {tutor.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300">
                    {tutor.experience}
                  </Badge>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{tutor.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Support Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Project Support
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Project Support
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Get help building academic or real-world projects with expert guidance and mentorship from industry professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-8 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border-0">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl w-fit mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                <Code className="h-12 w-12 text-blue-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">Java Projects</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Mini Projects in Java</p>
            </Card>
            <Card className="text-center p-8 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border-0">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl w-fit mx-auto mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                <Terminal className="h-12 w-12 text-green-600 group-hover:text-emerald-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-green-600 transition-colors">Python Projects</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Data Science & Automation</p>
            </Card>
            <Card className="text-center p-8 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border-0">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl w-fit mx-auto mb-6 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                <Brain className="h-12 w-12 text-purple-600 group-hover:text-pink-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-purple-600 transition-colors">ML Projects</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Machine Learning Models</p>
            </Card>
            <Card className="text-center p-8 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border-0">
              <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl w-fit mx-auto mb-6 group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300">
                <Globe className="h-12 w-12 text-orange-600 group-hover:text-red-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-orange-600 transition-colors">Web Apps</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Full Stack Applications</p>
            </Card>
          </div>
          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group" onClick={() => navigate("/auth")}>
              Request Project Assistance
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/10 to-purple-100/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Student Reviews
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Success stories from our learning community - real results from real students
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 group">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current group-hover:scale-110 transition-transform" style={{animationDelay: `${i * 0.1}s`}} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-lg leading-relaxed group-hover:text-gray-700 transition-colors">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-indigo-600 font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/10 to-indigo-100/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  TutorDash
                </span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                Empowering learners with expert tutoring and project support. 
                We bridge the gap between learning and practical implementation.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">Courses</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">contact@tutordash.com</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Live Chat Support</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-16 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              © 2024 TutorDash. All rights reserved. Built with passion for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
