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
  LogOut
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
          setSelectedSubject("");
          setTopic("");
          setSessionDate("");
          setSessionTime("");
          // Refresh sessions list
          fetchRequests();
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
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentName");
    window.location.href = "/auth/student";
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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
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
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    Book a Tutoring Session
                  </CardTitle>
                  <CardDescription>Select a subject and schedule your session</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectsLoading ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">Loading subjects...</div>
                          ) : subjects.length === 0 ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">No subjects available</div>
                          ) : (
                            subjects.map((subject) => (
                              <SelectItem key={subject._id} value={subject._id}>
                                {subject.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={sessionTime}
                          onChange={(e) => setSessionTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic Details</Label>
                      <Textarea
                        id="topic"
                        placeholder="e.g., Reviewing Newton's Laws, Algebra problems, Essay writing..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || subjectsLoading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-accent/20">
                <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    Your Progress
                  </CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    {studentStats.averageRating > 0 ? (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          Average Rating: {studentStats.averageRating.toFixed(1)}/5
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">No ratings yet</span>
                      </div>
                    )}
                    
                    {studentStats.favoriteSubject && studentStats.favoriteSubject !== "None" ? (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          Favorite Subject: {studentStats.favoriteSubject}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">No favorite subject yet</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
