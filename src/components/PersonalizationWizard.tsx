import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Sparkles,
  Target,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calculator,
  Atom,
  Microscope,
  Heart,
  Book,
  History,
  Globe,
  Code,
  Palette,
  Music,
  Search,
  User,
  Star,
  Award
} from "lucide-react";

interface PersonalizationWizardProps {
  studentName: string;
}

const goalOptions = [
  {
    id: "homework",
    title: "Help with homework",
    description: "Get assistance with assignments and problem-solving",
    icon: Book
  },
  {
    id: "exam-prep",
    title: "Prepare for an exam",
    description: "SAT, A-Levels, or other standardized tests",
    icon: Award
  },
  {
    id: "new-skill",
    title: "Learn a new skill or hobby",
    description: "Explore new subjects or deepen existing interests",
    icon: Sparkles
  },
  {
    id: "catch-up",
    title: "Catch up in a specific class",
    description: "Get back on track with coursework",
    icon: Target
  },
  {
    id: "exploring",
    title: "I'm just exploring",
    description: "See what tutoring can offer me",
    icon: Search
  }
];

const subjectOptions = [
  { id: "mathematics", name: "Mathematics", icon: Calculator, category: "STEM" },
  { id: "physics", name: "Physics", icon: Atom, category: "STEM" },
  { id: "chemistry", name: "Chemistry", icon: Microscope, category: "STEM" },
  { id: "biology", name: "Biology", icon: Heart, category: "STEM" },
  { id: "english", name: "English", icon: Book, category: "Language Arts" },
  { id: "history", name: "History", icon: History, category: "Social Studies" },
  { id: "geography", name: "Geography", icon: Globe, category: "Social Studies" },
  { id: "computer-science", name: "Computer Science", icon: Code, category: "STEM" },
  { id: "art", name: "Art", icon: Palette, category: "Creative Arts" },
  { id: "music", name: "Music", icon: Music, category: "Creative Arts" }
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PersonalizationWizard = ({ studentName }: PersonalizationWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const progress = (step / 4) * 100;

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleNext = () => {
    if (step === 2 && selectedGoals.length === 0) {
      toast.error("Please select at least one goal");
      return;
    }
    if (step === 3 && selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/student-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          goals: selectedGoals,
          selectedSubjects: selectedSubjects,
          onboardingCompleted: true,
        }),
      });

      if (response.ok) {
        toast.success("Profile saved successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          navigate("/student");
        }, 1000);
      } else {
        toast.error("Failed to save profile. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving your profile.");
      setLoading(false);
    }
  };

  const filteredSubjects = subjectOptions.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock recommended tutors based on selected subjects
  const getRecommendedTutors = () => {
    const mockTutors = [
      { id: "1", name: "Dr. Smith", subjects: ["Mathematics", "Physics"], rating: 4.9, students: 120 },
      { id: "2", name: "Prof. Johnson", subjects: ["Chemistry", "Biology"], rating: 4.8, students: 95 },
      { id: "3", name: "Ms. Williams", subjects: ["English", "History"], rating: 4.7, students: 88 },
      { id: "4", name: "Dr. Brown", subjects: ["Computer Science", "Mathematics"], rating: 4.9, students: 150 },
      { id: "5", name: "Ms. Davis", subjects: ["Art", "Music"], rating: 4.6, students: 75 }
    ];

    // Filter tutors based on selected subjects
    return mockTutors.filter(tutor =>
      selectedSubjects.some(subjectId => {
        const subjectName = subjectOptions.find(s => s.id === subjectId)?.name || "";
        return tutor.subjects.some(tSub => 
          tSub.toLowerCase().includes(subjectName.toLowerCase()) ||
          subjectName.toLowerCase().includes(tSub.toLowerCase())
        );
      })
    ).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {step} of 4</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Welcome Screen */}
        {step === 1 && (
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-12">
              <div className="text-center space-y-6 py-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome, {studentName}! 👋
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Let's personalize your learning experience. It will only take a minute.
                  </p>
                </div>
                <Button onClick={handleNext} size="lg" className="mt-4">
                  Let's Go!
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">What are your goals?</h2>
                  <p className="text-muted-foreground">Select one or more goals to help us personalize your experience</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {goalOptions.map((goal) => {
                    const IconComponent = goal.icon;
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <Card
                        key={goal.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected
                            ? "border-2 border-primary bg-primary/5 shadow-md"
                            : "border hover:border-primary/50"
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                              }`}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{goal.title}</h3>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{goal.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={selectedGoals.length === 0}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Subjects */}
        {step === 3 && (
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">What subjects do you need help with?</h2>
                  <p className="text-muted-foreground">Select all subjects you'd like to explore</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-2">
                  {filteredSubjects.map((subject) => {
                    const IconComponent = subject.icon;
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                      <Card
                        key={subject.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? "border-2 border-primary bg-primary/5"
                            : "border hover:border-primary/50"
                        }`}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                              }`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-sm">{subject.name}</h3>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                              </div>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {subject.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">Selected:</span>
                    {selectedSubjects.map((subjectId) => {
                      const subject = subjectOptions.find(s => s.id === subjectId);
                      return subject ? (
                        <Badge key={subjectId} variant="secondary" className="gap-1">
                          <subject.icon className="w-3 h-3" />
                          {subject.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={selectedSubjects.length === 0}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Customized Dashboard Preview */}
        {step === 4 && (
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold">All Set! 🎉</h2>
                  <p className="text-muted-foreground">Your personalized dashboard is ready</p>
                </div>

                {/* Recommended Tutors */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Recommended Tutors for You
                    </CardTitle>
                    <CardDescription>
                      These tutors specialize in the subjects you selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {getRecommendedTutors().map((tutor) => (
                        <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{tutor.name}</h4>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-medium">{tutor.rating}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {tutor.subjects.slice(0, 2).map((subject) => (
                                    <Badge key={subject} variant="outline" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {tutor.students} students
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Subjects Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Your Subjects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubjects.map((subjectId) => {
                        const subject = subjectOptions.find(s => s.id === subjectId);
                        return subject ? (
                          <Badge key={subjectId} variant="secondary" className="gap-2 px-3 py-2">
                            <subject.icon className="w-4 h-4" />
                            {subject.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleComplete} size="lg" className="bg-gradient-to-r from-primary to-accent" disabled={loading}>
                    {loading ? "Saving..." : "Complete Setup"}
                    {!loading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalizationWizard;
