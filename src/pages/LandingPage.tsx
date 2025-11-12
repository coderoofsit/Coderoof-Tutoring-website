import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  BarChart3,
  Star,
  ArrowRight,
  MessageCircle,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Lightbulb,
  Rocket,
  PlayCircle,
  ClipboardList,
  Sigma,
  Atom,
  FlaskConical,
  Beaker
} from "lucide-react";
import TutorAbout from "@/components/sections/TutorAbout";
import AppointmentForm from "@/components/sections/AppointmentForm";
import HowItWorks from "@/components/sections/HowItWorks";
import ServicesOverview from "@/components/sections/ServicesOverview";
import FAQ from "@/components/sections/FAQ";
import siteConfig from "@/config/site";
import Carousel from "./Carousel";
import FlowingMenu from "./FlowingMenu";

const LandingPage = () => {

  const subjectCategories = [
    {
      icon: <Sigma className="h-8 w-8 text-indigo-600" />,
      title: "Mathematics",
      description: "From foundational algebra to advanced linear algebra, every concept is broken down with clarity.",
      topics: [
        "Algebra",
        "Functions and Graphs",
        "Trigonometry",
        "Geometry",
        "Calculus",
        "Vectors and Matrices",
        "Probability and Statistics",
        "Sequences and Series",
        "Complex Numbers",
        "Linear Algebra",
        "Discrete Math"
      ]
    },
    {
      icon: <Atom className="h-8 w-8 text-indigo-600" />,
      title: "Physics",
      description: "Build intuition through real-world examples, visual aids, and carefully crafted problem sets.",
      topics: [
        "Kinematics",
        "Dynamics",
        "Work, Energy, and Power",
        "Momentum and Collisions",
        "Rotational Motion",
        "Gravitation",
        "Fluid Mechanics",
        "Thermodynamics",
        "Waves and Oscillations",
        "Sound",
        "Optics",
        "Electricity and Magnetism",
        "Electromagnetic Induction",
        "Modern Physics",
        "Quantum Physics and Relativity"
      ]
    },
    {
      icon: <FlaskConical className="h-8 w-8 text-indigo-600" />,
      title: "Chemistry",
      description: "Understand the why behind every reaction with structured notes and practice questions.",
      topics: [
        "Atomic Structure",
        "Periodic Table and Periodicity",
        "Chemical Bonding and Molecular Structure",
        "Stoichiometry",
        "States of Matter",
        "Thermodynamics",
        "Chemical and Ionic Equilibrium",
        "Electrochemistry",
        "Chemical Kinetics",
        "Solutions and Colligative Properties",
        "Redox Reactions",
        "Coordination Compounds",
        "Surface Chemistry",
        "Environmental Chemistry"
      ]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: "Statistics",
      description: "Combine theory with data-driven projects to build practical analytical confidence.",
      topics: [
        "Descriptive Statistics",
        "Probability Theory",
        "Random Variables and Distributions",
        "Sampling Methods",
        "Estimation and Confidence Intervals",
        "Hypothesis Testing",
        "Correlation and Regression",
        "Time Series Analysis",
        "Non-Parametric Tests",
        "Experimental Design and Data Interpretation"
      ]
    },
    {
      icon: <Beaker className="h-8 w-8 text-indigo-600" />,
      title: "Organic Chemistry",
      description: "Learn to decode mechanisms, predict outcomes, and justify every step of a synthesis route.",
      topics: [
        "Structure and Bonding",
        "Nomenclature and Isomerism",
        "Reaction Mechanisms",
        "Hydrocarbons",
        "Alcohols, Phenols, and Ethers",
        "Aldehydes and Ketones",
        "Carboxylic Acids and Derivatives",
        "Amines and Amides",
        "Biomolecules",
        "Spectroscopy and Structural Determination",
        "Polymers",
        "Reaction Intermediates"
      ]
    }
  ];

  const heroStats = [
    { label: "Students mentored", value: "500+" },
    { label: "Years experience", value: `${siteConfig.tutor.experienceYears}+` },
    { label: "Success rate", value: "98%" }
  ];

  const phoneLink = siteConfig.contact.phone.replace(/[^+\d]/g, "");

  // Single tutor site: remove multi-tutor list

  const openBookingForm = () => {
    if (typeof document === "undefined") return;
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#booking";
    }

    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      const focusTarget = bookingForm.querySelector<HTMLElement>("input, select, textarea");
      if (focusTarget) {
        setTimeout(() => focusTarget.focus(), 400);
      }
    }
  };

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Mathematics Undergraduate",
      quote: "Matt's calculus and linear algebra sessions turned dense proofs into patterns I can now explain with ease.",
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Priya Desai",
      role: "Statistics Graduate Student",
      quote: "Our weekly probability clinics rewired how I approach inference. My statistical modeling now feels precise and confident.",
      image: "https://i.pravatar.cc/150?img=32"
    },
    {
      name: "David Kim",
      role: "Physics Transfer Student",
      quote: "Mechanics and electromagnetism finally made sense once Matt tied every equation to a physical intuition I could visualize.",
      image: "https://i.pravatar.cc/150?img=15"
    },
    {
      name: "Hannah Lee",
      role: "Chemistry Honors Student",
      quote: "Thermodynamics and kinetics went from memorization to mastery. Matt's chemistry roadmaps keep every concept connected.",
      image: "https://i.pravatar.cc/150?img=47"
    },
    {
      name: "Miguel Alvarez",
      role: "High School Senior",
      quote: "Organic chemistry stopped being a mystery once we sketched mechanisms together. I now predict reactions with confidence.",
      image: "https://i.pravatar.cc/150?img=28"
    },
    {
      name: "Aisha Rahman",
      role: "Physical Chemistry Researcher",
      quote: "Deriving equilibrium expressions step by step with Matt sharpened my lab analysis and made spectroscopy data far clearer.",
      image: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Noah Feldman",
      role: "Quantitative Analyst",
      quote: "Matt's statistics coaching helped me rebuild probability fundamentals, so my forecasting models now hold up under scrutiny.",
      image: "https://i.pravatar.cc/150?img=21"
    },
    {
      name: "Sofia Marin",
      role: "Pre-Med Student",
      quote: "Balancing organic chemistry with general chem prep felt doable once Matt split topics into bite-sized synthesis checkpoints.",
      image: "https://i.pravatar.cc/150?img=36"
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-indigo-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#process" className="hover:text-indigo-600 transition-colors">How it works</a>
              <a href="#services" className="hover:text-indigo-600 transition-colors">Services</a>
              <a href="#subjects" className="hover:text-indigo-600 transition-colors">What I teach</a>
              <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
              <a href="#booking" className="hover:text-indigo-600 transition-colors">Book a session</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                onClick={openBookingForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Rocket className="h-4 w-4" />
                {siteConfig.tagLine}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Personalized tutoring with <span className="text-indigo-600">{siteConfig.tutor.fullName}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                {siteConfig.tutor.blurbPrimary}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold group" 
                  onClick={() => (window.location.href = "mailto:" + siteConfig.contact.email)}
                >
                  Book a free intro call
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold" 
                  onClick={openBookingForm}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Book your first session
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600 uppercase tracking-wide text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    <HowItWorks />

    <ServicesOverview />

    <FAQ />

  {/* What We Teach Section */}
      <section id="subjects" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
          <div className="absolute inset-0 radial-overlay-b"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Core Subjects
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              What I Teach
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Concentrated coaching across math, physics, chemistry, statistics, and organic chemistry tailored to your goals.
            </p>
          </div>
          <div className="relative mx-auto h-[320px] w-full max-w-5xl sm:h-[360px]">
            <Carousel
              baseWidth={320}
              autoplay
              autoplayDelay={3000}
              pauseOnHover
              loop
              round={false}
              className="h-full"
            >
              {subjectCategories.map((category) => (
                <Card
                  key={category.title}
                  className="flex h-full flex-col items-center justify-center border border-indigo-100/60 bg-white/95 backdrop-blur-sm shadow-lg"
                >
                  <CardHeader className="pb-0">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="rounded-2xl bg-indigo-50 p-4">
                        {category.icon}
                      </div>
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-center text-sm text-gray-600">
                    {category.description}
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Expert Tutors Section removed for single tutor focus */}

      {/* About the Tutor Section */}
      {false && (
        <section id="about" className="py-20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-purple-100/20"></div>
            <div className="absolute inset-0 radial-overlay-a"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Lightbulb className="h-4 w-4" />
                About the Tutor
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Personalized One-on-One Tutoring
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                {siteConfig.tutor.blurbSecondary}
              </p>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
                <p className="text-xl font-semibold italic">
                  "I bridge the gap between learning and practical implementation."
                </p>
              </div>
            </div>
            <TutorAbout />
          </div>
        </section>
      )}

      {/* Testimonials Section */}
  <section id="testimonials" className="py-20 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/10 to-purple-100/10"></div>
          <div className="absolute inset-0 radial-overlay-d"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Student Reviews
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What My Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Success stories from my tutoring sessions - real results from real students
            </p>
          </div>
          <div className="mx-auto h-[520px] w-full max-w-5xl">
            <FlowingMenu items={testimonials} />
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
          <div className="absolute inset-0 radial-overlay-c"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ClipboardList className="h-4 w-4" />
              Book a session
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Tell me what you need and secure your slot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your goals, upload reference material, and choose the timing that fits. I will confirm details right away.
            </p>
          </div>
          <AppointmentForm subjects={subjectCategories.map(({ title, topics }) => ({ title, topics }))} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/10 to-indigo-100/10"></div>
          <div className="absolute inset-0 radial-overlay-footer"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {siteConfig.name}
                </span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                Empowering learners with expert tutoring and project support. 
                I bridge the gap between learning and practical implementation.
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
                <li><a href="#services" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">Services</a></li>
                <li><a href="#subjects" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">What I teach</a></li>
                <li><a href="#process" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">How it works</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">FAQ</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Contact Info</h3>
              <div id="contact" className="space-y-4">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline">
                    {siteConfig.contact.email}
                  </span>
                </a>
                <a
                  href={`tel:${phoneLink}`}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline">
                    {siteConfig.contact.phone}
                  </span>
                </a>
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
              © 2025 {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
