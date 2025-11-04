import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  BookOpen, Calendar, Clock, FileText, AlertCircle, 
  GraduationCap, TrendingUp, Award, Star, Users,
  Target, Zap, Brain, Calculator, Atom, Globe,
  Heart, Music, Palette, Code, Book, Microscope,
  History, MapPin, Activity, CheckCircle, XCircle,
  Timer, User, MessageSquare, Lightbulb, Search,
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight
} from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
}

interface SessionRequest {
  _id: string;
  subjectId: {
    _id: string;
    name: string;
    description?: string;
  };
  topic: string;
  sessionDate: string;
  sessionTime: string;
  status: string;
  teacherId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  studentId: any;
  createdAt: string;
  updatedAt: string;
}

interface StudentStats {
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  averageRating: number;
  favoriteSubject: string;
}

interface StudentProfile {
  goals: string[];
  selectedSubjects: string[];
  onboardingCompleted: boolean;
}

interface RecommendedTutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  students: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Booking Wizard Component
interface BookingWizardProps {
  subjects: Subject[];
  subjectsLoading: boolean;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  sessionDate: string;
  setSessionDate: (value: string) => void;
  sessionTime: string;
  setSessionTime: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<boolean | void>;
  loading: boolean;
  getSubjectIcon: (name: string) => any;
  getSubjectCategory: (name: string) => string;
}

const BookingWizard = ({
  subjects,
  subjectsLoading,
  selectedSubject,
  setSelectedSubject,
  sessionDate,
  setSessionDate,
  sessionTime,
  setSessionTime,
  topic,
  setTopic,
  handleSubmit,
  loading,
  getSubjectIcon,
  getSubjectCategory
}: BookingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [scheduleSubStep, setScheduleSubStep] = useState<'date' | 'time'>('date');

  const totalSteps = 4;

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      (subject.description?.toLowerCase().includes(subjectSearch.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
      getSubjectCategory(subject.name) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(subjects.map(s => getSubjectCategory(s.name))))];

  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Fetch unavailable slots when date changes
  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      if (!sessionDate) {
        setUnavailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUnavailableSlots([]);
          return;
        }

        const response = await fetch(`${API_URL}/sessions/unavailable-slots?date=${sessionDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUnavailableSlots(data.data.unavailableSlots || []);
          }
        } else {
          setUnavailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching unavailable slots:", error);
        setUnavailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchUnavailableSlots();
  }, [sessionDate]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedSubject) {
      toast.error("Please select a subject");
      return;
    }
    if (currentStep === 2) {
      if (!sessionDate) {
        toast.error("Please select a date first");
        return;
      }
      if (!sessionTime) {
        toast.error("Please select a time slot");
        return;
      }
      if (unavailableSlots.includes(sessionTime)) {
        toast.error("The selected time slot is already booked and unavailable. Please choose another time.");
        return;
      }
    }
    if (currentStep === 3 && !topic.trim()) {
      toast.error("Please provide topic details");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    // If in step 2 and on time selection, go back to date selection
    if (currentStep === 2 && scheduleSubStep === 'time') {
      setScheduleSubStep('date');
      setSessionTime(""); // Clear time when going back to date selection
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      // Reset schedule sub-step when going back from step 2
      if (currentStep === 3) {
        setScheduleSubStep('date');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) {
      // Reset wizard to first step
      setCurrentStep(1);
      setSubjectSearch("");
      setSelectedCategory("all");
      setScheduleSubStep('date');
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="shadow-lg border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                        ? "bg-primary text-white scale-110"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center ${step === currentStep ? "font-medium text-primary" : "text-muted-foreground"}`}>
                    {step === 1 && "Subject"}
                    {step === 2 && "Schedule"}
                    {step === 3 && "Details"}
                    {step === 4 && "Confirm"}
                  </p>
                </div>
                {step < totalSteps && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      step < currentStep ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="shadow-xl border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {currentStep === 1 && "Choose a Subject"}
            {currentStep === 2 && "Select Date & Time"}
            {currentStep === 3 && "Add Session Details"}
            {currentStep === 4 && "Review & Confirm"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Select the subject you'd like help with"}
            {currentStep === 2 && scheduleSubStep === 'date' && "First, select your preferred date"}
            {currentStep === 2 && scheduleSubStep === 'time' && "Now, choose a time slot for your session"}
            {currentStep === 3 && "Tell us what you'd like to focus on"}
            {currentStep === 4 && "Review your booking details before submitting"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={currentStep === 4 ? handleFormSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Subject Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search subjects..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Grid */}
                {subjectsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading subjects...</p>
                  </div>
                ) : filteredSubjects.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No subjects found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredSubjects.map((subject) => {
                      const IconComponent = getSubjectIcon(subject.name);
                      const isSelected = selectedSubject === subject._id;
                      return (
                        <Card
                          key={subject._id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            isSelected
                              ? "border-2 border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedSubject(subject._id)}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                                }`}
                              >
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base mb-1">{subject.name}</h4>
                                <Badge variant="outline" className="text-xs mb-2">
                                  {getSubjectCategory(subject.name)}
                                </Badge>
                                {subject.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {subject.description}
                                  </p>
                                )}
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && (
              <div className="space-y-6 -mx-6 px-6">
                {/* Selected Subject Display */}
                {selectedSubjectData && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {(() => {
                          const IconComponent = getSubjectIcon(selectedSubjectData.name);
                          return <IconComponent className="w-5 h-5 text-primary" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Subject</p>
                        <p className="font-semibold">{selectedSubjectData.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-3 w-full">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Select Date
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
                    {getNextAvailableDates().map((date) => {
                      const dateString = date.toISOString().split("T")[0];
                      const isSelected = sessionDate === dateString;
                      const isToday = dateString === new Date().toISOString().split("T")[0];
                      return (
                        <button
                          key={dateString}
                          type="button"
                          onClick={() => {
                            // If changing to a different date, clear the time
                            if (sessionDate && sessionDate !== dateString) {
                              setSessionTime("");
                            }
                            setSessionDate(dateString);
                            // Automatically move to time selection after date is selected
                            setScheduleSubStep('time');
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <p className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                          <p className="text-lg font-bold mt-1">{date.getDate()}</p>
                          <p className="text-xs">{date.toLocaleDateString("en-US", { month: "short" })}</p>
                          {isToday && (
                            <p className="text-xs mt-1 text-primary font-medium">Today</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <Input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => {
                      // If changing to a different date, clear the time
                      if (sessionDate && sessionDate !== e.target.value) {
                        setSessionTime("");
                      }
                      setSessionDate(e.target.value);
                      // Automatically move to time selection after date is selected
                      if (e.target.value) {
                        setScheduleSubStep('time');
                      }
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-4 w-full"
                  />
                </div>

                {/* Show time selection only after date is selected */}
                {scheduleSubStep === 'time' && sessionDate && (
                  <>
                    {/* Selected Date Display */}
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Selected Date</p>
                            <p className="font-semibold">{formatDateDisplay(sessionDate)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setScheduleSubStep('date');
                            setSessionDate("");
                            setSessionTime("");
                          }}
                          className="text-xs"
                        >
                          Change Date
                        </Button>
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Select Time
                    {loadingSlots && sessionDate && (
                      <span className="text-xs text-muted-foreground ml-2">(Checking availability...)</span>
                    )}
                  </Label>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {timeSlots.map((time) => {
                      const isSelected = sessionTime === time;
                      const isUnavailable = unavailableSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            if (!isUnavailable) {
                              setSessionTime(time);
                            } else {
                              toast.error("This time slot is already booked and unavailable");
                            }
                          }}
                          disabled={isUnavailable}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            isUnavailable
                              ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          title={isUnavailable ? "This slot is already booked" : undefined}
                        >
                          {time}
                          {isUnavailable && (
                            <span className="block text-xs mt-1 text-red-500 font-normal">Unavailable</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <Input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="mt-4"
                  />
                    </div>
                  </>
                )}

                {/* Show message if date not selected yet */}
                {scheduleSubStep === 'date' && !sessionDate && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Select a date first</p>
                        <p className="text-blue-700">Choose your preferred date to see available time slots</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Topic Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Session Summary */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-5 rounded-lg border border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {selectedSubjectData && (() => {
                          const IconComponent = getSubjectIcon(selectedSubjectData.name);
                          return <IconComponent className="w-5 h-5 text-primary" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <p className="font-semibold">{selectedSubjectData?.name || "Not selected"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-semibold">
                          {formatDateDisplay(sessionDate) || "Not selected"} at {sessionTime || "Not selected"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topic Input */}
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    What would you like to focus on?
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., Reviewing Newton's Laws, Algebra problems, Essay writing, Exam preparation..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      Be specific about topics, concepts, or areas you want help with. This helps us match you with the right tutor.
                    </p>
                  </div>
                </div>

                {/* Topic Suggestions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Common topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Exam preparation", "Homework help", "Concept review", "Practice problems", "Assignment help"].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setTopic(prev => prev ? `${prev}, ${suggestion}` : suggestion)}
                        className="px-3 py-1.5 text-sm bg-muted hover:bg-primary/10 rounded-full border border-muted-foreground/20 transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-primary/5 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ready to book your session!</h3>
                      <p className="text-sm text-muted-foreground">Review your details below</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-white/60 p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        {selectedSubjectData && (() => {
                          const IconComponent = getSubjectIcon(selectedSubjectData.name);
                          return <IconComponent className="w-6 h-6 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <p className="font-semibold text-lg">{selectedSubjectData?.name}</p>
                        {selectedSubjectData?.description && (
                          <p className="text-sm text-muted-foreground mt-1">{selectedSubjectData.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-semibold">{formatDateDisplay(sessionDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-semibold">{sessionTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Topic Details</p>
                      <p className="font-medium whitespace-pre-wrap">{topic}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">What happens next?</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Your session request will be reviewed by our team</li>
                        <li>You'll receive a confirmation once a tutor is assigned</li>
                        <li>Any updates will be sent to your email</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Timer className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm & Book Session
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const StudentView = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [recommendedTutors, setRecommendedTutors] = useState<RecommendedTutor[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats>({
    totalSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    averageRating: 0,
    favoriteSubject: ""
  });

  useEffect(() => {
    loadStudentName();
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (studentProfile?.onboardingCompleted) {
      fetchSubjects();
      fetchRequests();
    }
  }, [studentProfile]);

  const loadStudentName = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/student";
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStudentName(data.data.name);
          setStudentId(data.data.id);
          localStorage.setItem("studentName", data.data.name);
        }
      }
    } catch (error) {
      console.error("Error loading student name:", error);
      setStudentName("Student");
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/student";
        return;
      }

      const response = await fetch(`${API_URL}/student-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.onboardingCompleted) {
          setStudentProfile(data.data);
          loadRecommendedTutors(data.data.selectedSubjects || []);
        } else {
          window.location.href = "/onboarding";
        }
      } else {
        window.location.href = "/onboarding";
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      window.location.href = "/onboarding";
    }
  };

  const loadRecommendedTutors = async (selectedSubjects: string[]) => {
    // TODO: Replace with real API call when tutor recommendation endpoint is available
    setRecommendedTutors([]);
  };

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await fetch(`${API_URL}/subjects`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSubjects(data.data);
        }
      } else {
        toast.error("Failed to load subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setSessionsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/student";
        return;
      }

      const response = await fetch(`${API_URL}/sessions/my-sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setRequests(data.data);
          calculateStudentStats(data.data);
        }
      } else {
        toast.error("Failed to load sessions");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const calculateStudentStats = (sessions: SessionRequest[]) => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(r => r.status === "Completed").length;
    const pendingSessions = sessions.filter(r => r.status === "Pending").length;
    
    // Calculate favorite subject based on most booked subject
    const subjectCounts: Record<string, number> = {};
    sessions.forEach(session => {
      const subjectName = session.subjectId?.name || "Unknown";
      subjectCounts[subjectName] = (subjectCounts[subjectName] || 0) + 1;
    });
    
    const favoriteSubject = Object.keys(subjectCounts).length > 0
      ? Object.keys(subjectCounts).reduce((a, b) => 
          subjectCounts[a] > subjectCounts[b] ? a : b
        )
      : "None";

    // Calculate average rating (for now 0, as ratings aren't implemented yet)
    // TODO: Calculate from actual ratings when rating system is implemented
    const averageRating = 0;

    setStudentStats({
      totalSessions,
      completedSessions,
      pendingSessions,
      averageRating,
      favoriteSubject
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/student";
        return;
      }

      const response = await fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectId: selectedSubject,
          topic,
          sessionDate,
          sessionTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Session request submitted successfully!");
          // Reset form
          setSelectedSubject("");
          setTopic("");
          setSessionDate("");
          setSessionTime("");
          // Refresh sessions list
          fetchRequests();
          // Reset wizard step (this will be handled by BookingWizard's state reset)
          return true;
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
    return false;
  };


  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Pending: "secondary",
      Approved: "default",
      Completed: "default",
      Rejected: "destructive",
      Cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getSubjectIcon = (name: string) => {
    const icons: Record<string, any> = {
      "Mathematics": Calculator,
      "Physics": Atom,
      "Chemistry": Microscope,
      "Biology": Heart,
      "English": Book,
      "History": History,
      "Geography": Globe,
      "Computer Science": Code,
      "Art": Palette,
      "Music": Music
    };
    return icons[name] || BookOpen;
  };

  const getSubjectDifficulty = (name: string) => {
    const difficulties: Record<string, string> = {
      "Mathematics": "Intermediate",
      "Physics": "Advanced",
      "Chemistry": "Intermediate",
      "Biology": "Beginner",
      "English": "Beginner",
      "History": "Beginner",
      "Geography": "Beginner",
      "Computer Science": "Advanced",
      "Art": "Beginner",
      "Music": "Intermediate"
    };
    return difficulties[name] || "Beginner";
  };

  const getSubjectCategory = (name: string) => {
    const categories: Record<string, string> = {
      "Mathematics": "STEM",
      "Physics": "STEM",
      "Chemistry": "STEM",
      "Biology": "STEM",
      "English": "Language Arts",
      "History": "Social Studies",
      "Geography": "Social Studies",
      "Computer Science": "STEM",
      "Art": "Creative Arts",
      "Music": "Creative Arts"
    };
    return categories[name] || "General";
  };

  if (!studentProfile?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-4 md:p-6 rounded-xl border border-primary/20 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {studentName}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg shadow-sm">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium hidden sm:inline">Student Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-blue-500">{studentStats.totalSessions}</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Sessions</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-green-500">{studentStats.completedSessions}</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Completed</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-orange-500">{studentStats.pendingSessions}</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Pending</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Timer className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-purple-500">
                    {studentStats.averageRating > 0 ? studentStats.averageRating.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Avg Rating</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="book" className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-primary/10">
            <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
              <TabsTrigger 
                value="book" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Book Session</span>
                <span className="sm:hidden">Book</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subjects" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger 
                value="sessions" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">My Sessions</span>
                <span className="sm:hidden">Sessions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Book Session Tab */}
          <TabsContent value="book" className="space-y-6">
            <BookingWizard
              subjects={subjects}
              subjectsLoading={subjectsLoading}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              sessionDate={sessionDate}
              setSessionDate={setSessionDate}
              sessionTime={sessionTime}
              setSessionTime={setSessionTime}
              topic={topic}
              setTopic={setTopic}
              handleSubmit={handleSubmit}
              loading={loading}
              getSubjectIcon={getSubjectIcon}
              getSubjectCategory={getSubjectCategory}
            />
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Available Subjects
                </CardTitle>
                <CardDescription>Explore our comprehensive range of subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {subjectsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading subjects...</p>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No subjects available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => {
                      const IconComponent = getSubjectIcon(subject.name);
                      return (
                        <Card 
                          key={subject._id} 
                          className="hover:shadow-md transition-all cursor-pointer group"
                        >
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                  <IconComponent className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{subject.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {subject.category || getSubjectCategory(subject.name)}
                                  </p>
                                </div>
                              </div>
                              {subject.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {subject.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {subject.difficulty || getSubjectDifficulty(subject.name)}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedSubject(subject._id);
                                    const bookTab = document.querySelector('[value="book"]') as HTMLElement;
                                    bookTab?.click();
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Select
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Your Session Requests
                </CardTitle>
                <CardDescription>Track the status of your tutoring sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading sessions...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No session requests yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Book your first session to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <Card 
                        key={request._id} 
                        className="border-l-4 border-l-primary/30 hover:shadow-md transition-all"
                      >
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {request.subjectId?.name?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {request.subjectId?.name || "Unknown Subject"}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{request.topic}</p>
                                </div>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>

                            <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(request.sessionDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {request.sessionTime}
                              </span>
                              <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Requested: {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {request.teacherId && (
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Assigned Teacher: {request.teacherId.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentView;
