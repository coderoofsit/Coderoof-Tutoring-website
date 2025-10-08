import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  BookOpen, Calendar, Clock, FileText, AlertCircle, 
  GraduationCap, TrendingUp, Award, Star, Users,
  Target, Zap, Brain, Calculator, Atom, Globe,
  Heart, Music, Palette, Code, Book, Microscope,
  History, MapPin, Activity, CheckCircle, XCircle,
  Timer, User, MessageSquare, Lightbulb
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  difficulty?: string;
  category?: string;
}

interface SessionRequest {
  id: string;
  subject_id: string;
  topic: string;
  session_date: string;
  session_time: string;
  status: string;
  teacher_id: string | null;
  subjects: { name: string };
  teachers: { name: string } | null;
  created_at: string;
}

interface StudentStats {
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  averageRating: number;
  favoriteSubject: string;
}

const StudentView = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats>({
    totalSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    averageRating: 0,
    favoriteSubject: ""
  });

  useEffect(() => {
    fetchSubjects();
    fetchRequests();
    setupRealtimeSubscription();
    loadStudentName();
  }, []);

  const loadStudentName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.student_name) {
      setStudentName(user.user_metadata.student_name);
    } else {
      setStudentName(user?.email?.split('@')[0] || "Student");
    }
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load subjects");
    } else {
      // Enhance subjects with descriptions and metadata
      const enhancedSubjects = (data || []).map(subject => ({
        ...subject,
        description: getSubjectDescription(subject.name),
        icon: getSubjectIcon(subject.name),
        difficulty: getSubjectDifficulty(subject.name),
        category: getSubjectCategory(subject.name)
      }));
      setSubjects(enhancedSubjects);
    }
  };

  const getSubjectDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      "Mathematics": "Master fundamental concepts from algebra to calculus. Build problem-solving skills and mathematical reasoning.",
      "Physics": "Explore the laws of nature through experiments and theory. Understand motion, energy, and the universe.",
      "Chemistry": "Discover the building blocks of matter. Learn about atoms, molecules, and chemical reactions.",
      "Biology": "Study living organisms and their interactions. From cells to ecosystems, understand life itself.",
      "English": "Develop communication skills through literature, writing, and critical thinking.",
      "History": "Journey through time to understand past events and their impact on today's world.",
      "Geography": "Explore our planet's physical features, climates, and human populations.",
      "Computer Science": "Learn programming, algorithms, and how computers work. Build the future with code.",
      "Art": "Express creativity through various mediums. Develop artistic skills and aesthetic appreciation.",
      "Music": "Learn theory, composition, and performance. Discover the universal language of music."
    };
    return descriptions[name] || "Explore this fascinating subject and expand your knowledge.";
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

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("session_requests")
      .select(`
        *,
        subjects (name),
        teachers (name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load your requests");
    } else {
      setRequests(data || []);
      calculateStudentStats(data || []);
    }
  };

  const calculateStudentStats = (requests: SessionRequest[]) => {
    const totalSessions = requests.length;
    const completedSessions = requests.filter(r => r.status === "Approved").length;
    const pendingSessions = requests.filter(r => r.status === "Pending").length;
    
    // Calculate favorite subject
    const subjectCounts: Record<string, number> = {};
    requests.forEach(request => {
      const subjectName = request.subjects.name;
      subjectCounts[subjectName] = (subjectCounts[subjectName] || 0) + 1;
    });
    const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) => 
      subjectCounts[a] > subjectCounts[b] ? a : b, "None"
    );

    setStudentStats({
      totalSessions,
      completedSessions,
      pendingSessions,
      averageRating: 4.5, // Mock rating for now
      favoriteSubject
    });
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("session_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_requests",
        },
        async (payload) => {
          if (payload.eventType === "UPDATE" && payload.new.status === "Approved") {
            const { data } = await supabase
              .from("session_requests")
              .select(`
                *,
                subjects (name),
                teachers (name)
              `)
              .eq("id", payload.new.id)
              .single();

            if (data && data.teachers) {
              const notificationText = `Your session for ${data.topic} on ${new Date(
                data.session_date
              ).toLocaleDateString()} at ${data.session_time} has been approved and assigned to ${
                data.teachers.name
              }!`;
              setNotification(notificationText);
              toast.success(notificationText);
              setTimeout(() => setNotification(null), 8000);
            }
          }
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("session_requests").insert({
        user_id: user.id,
        student_name: studentName,
        subject_id: selectedSubject,
        topic,
        session_date: sessionDate,
        session_time: sessionTime,
        status: "Pending",
      });

      if (error) throw error;

      toast.success("Session request submitted successfully!");
      setSelectedSubject("");
      setTopic("");
      setSessionDate("");
      setSessionTime("");
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Pending: "secondary",
      Approved: "default",
      Rejected: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Student Dashboard</span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20 animate-fade-in">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-success mt-0.5" />
                <p className="text-success-foreground font-medium">{notification}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">{studentStats.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">{studentStats.completedSessions}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{studentStats.pendingSessions}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <Timer className="w-8 h-8 text-orange-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-500">{studentStats.averageRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
                <Star className="w-8 h-8 text-purple-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="book" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="book" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Book Session
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Sessions
            </TabsTrigger>
          </TabsList>

          {/* Book Session Tab */}
          <TabsContent value="book" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Book a Tutoring Session
                  </CardTitle>
                  <CardDescription>Select a subject and schedule your session</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              <div className="flex items-center gap-2">
                                {subject.icon && <subject.icon className="w-4 h-4" />}
                                {subject.name}
                              </div>
                            </SelectItem>
                          ))}
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

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sessions Completed</span>
                      <span className="text-sm text-muted-foreground">
                        {studentStats.completedSessions} / {studentStats.totalSessions}
                      </span>
                    </div>
                    <Progress 
                      value={studentStats.totalSessions > 0 ? (studentStats.completedSessions / studentStats.totalSessions) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Average Rating: {studentStats.averageRating}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Favorite Subject: {studentStats.favoriteSubject}</span>
                    </div>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject, index) => {
                    const IconComponent = subject.icon;
                    return (
                      <Card 
                        key={subject.id} 
                        className="hover:shadow-md transition-all duration-300 animate-fade-in cursor-pointer group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{subject.name}</h4>
                                <p className="text-sm text-muted-foreground">{subject.category}</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {subject.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {subject.difficulty}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedSubject(subject.id)}
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
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No session requests yet.</p>
                      <p className="text-sm text-muted-foreground">Book your first session to get started!</p>
                    </div>
                  ) : (
                    requests.map((request, index) => (
                      <Card 
                        key={request.id} 
                        className="border-l-4 border-l-primary/30 hover:shadow-md transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {request.subjects.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-lg">{request.subjects.name}</h4>
                                  <p className="text-sm text-muted-foreground">{request.topic}</p>
                                </div>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(request.session_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {request.session_time}
                              </span>
                              <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                {new Date(request.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            {request.teachers && (
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Assigned Teacher: {request.teachers.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentView;
