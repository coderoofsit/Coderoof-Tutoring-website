import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Users, Calendar, Clock, BookOpen, Check, X, Plus, 
  UserPlus, GraduationCap, TrendingUp, AlertCircle, 
  Search, Filter, MoreHorizontal, Edit, Trash2,
  Shield, Star, Award, Activity
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email?: string;
  subjects?: { name: string }[];
  created_at?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  total_sessions: number;
  active_sessions: number;
  last_activity: string;
}

interface SessionRequest {
  id: string;
  student_name: string;
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

const AdminView = () => {
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchTeachers();
    fetchStudents();
    setupRealtimeSubscription();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("session_requests")
      .select(`
        *,
        subjects (name),
        teachers (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load requests");
    } else {
      setRequests(data || []);
    }
  };

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load teachers");
    } else {
      setTeachers(data || []);
    }
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("session_requests")
      .select(`
        user_id,
        student_name,
        created_at,
        status
      `);

    if (error) {
      toast.error("Failed to load students");
    } else {
      // Process student data
      const studentMap = new Map();
      data?.forEach((request) => {
        if (!studentMap.has(request.user_id)) {
          studentMap.set(request.user_id, {
            id: request.user_id,
            name: request.student_name,
            email: `student${request.user_id.slice(0, 8)}@example.com`,
            total_sessions: 0,
            active_sessions: 0,
            last_activity: request.created_at,
          });
        }
        const student = studentMap.get(request.user_id);
        student.total_sessions++;
        if (request.status === "Approved") {
          student.active_sessions++;
        }
      });
      setStudents(Array.from(studentMap.values()));
    }
  };

  const addTeacher = async () => {
    if (!newTeacherName.trim()) {
      toast.error("Teacher name is required");
      return;
    }

    const { error } = await supabase
      .from("teachers")
      .insert({
        name: newTeacherName,
        email: newTeacherEmail || null,
      });

    if (error) {
      toast.error("Failed to add teacher");
    } else {
      toast.success("Teacher added successfully!");
      setNewTeacherName("");
      setNewTeacherEmail("");
      setIsAddingTeacher(false);
      fetchTeachers();
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("admin_session_requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_requests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApprove = async (requestId: string) => {
    const teacherId = teacherAssignments[requestId];
    if (!teacherId) {
      toast.error("Please select a teacher first");
      return;
    }

    const { error } = await supabase
      .from("session_requests")
      .update({
        status: "Approved",
        teacher_id: teacherId,
      })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to approve request");
    } else {
      toast.success("Session approved successfully!");
      setTeacherAssignments((prev) => {
        const newAssignments = { ...prev };
        delete newAssignments[requestId];
        return newAssignments;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await supabase
      .from("session_requests")
      .update({
        status: "Rejected",
      })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to reject request");
    } else {
      toast.success("Session rejected");
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

  const getStatusCounts = () => {
    return {
      pending: requests.filter((r) => r.status === "Pending").length,
      approved: requests.filter((r) => r.status === "Approved").length,
      rejected: requests.filter((r) => r.status === "Rejected").length,
    };
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subjects.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your tutoring platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Admin Panel</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{counts.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">{counts.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved Sessions</p>
                </div>
                <Check className="w-8 h-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-500">{counts.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected Requests</p>
                </div>
                <X className="w-8 h-8 text-red-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">{teachers.length}</p>
                  <p className="text-sm text-muted-foreground">Active Teachers</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Session Requests
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
          </TabsList>

          {/* Session Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Session Requests
                    </CardTitle>
                    <CardDescription>Manage and assign tutoring sessions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No session requests found.</p>
                    </div>
                  ) : (
                    filteredRequests.map((request, index) => (
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
                                    {request.student_name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-lg">{request.student_name}</h4>
                                  <p className="text-sm text-muted-foreground">{request.subjects.name}</p>
                                </div>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>

                            <div className="bg-secondary/50 p-4 rounded-lg">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Topic:</span> {request.topic}
                              </p>
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

                            {request.status === "Pending" && (
                              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex-1">
                                  <Select
                                    value={teacherAssignments[request.id] || ""}
                                    onValueChange={(value) =>
                                      setTeacherAssignments((prev) => ({
                                        ...prev,
                                        [request.id]: value,
                                      }))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                          {teacher.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(request.id)}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {request.status === "Approved" && request.teachers && (
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Assigned to: {request.teachers.name}
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

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Teachers
                    </CardTitle>
                    <CardDescription>Manage your teaching staff</CardDescription>
                  </div>
                  <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Teacher</DialogTitle>
                        <DialogDescription>
                          Add a new teacher to your platform.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="teacherName">Teacher Name</Label>
                          <Input
                            id="teacherName"
                            placeholder="Enter teacher name"
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacherEmail">Email (Optional)</Label>
                          <Input
                            id="teacherEmail"
                            type="email"
                            placeholder="Enter teacher email"
                            value={newTeacherEmail}
                            onChange={(e) => setNewTeacherEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingTeacher(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addTeacher}>
                          Add Teacher
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((teacher, index) => (
                    <Card 
                      key={teacher.id} 
                      className="hover:shadow-md transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                              {teacher.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{teacher.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {teacher.email || "No email provided"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-muted-foreground">Active</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Active Students
                </CardTitle>
                <CardDescription>View and manage student activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student, index) => (
                    <Card 
                      key={student.id} 
                      className="hover:shadow-md transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-accent/10 text-accent text-lg">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <p className="font-semibold text-blue-600">{student.total_sessions}</p>
                              <p className="text-xs text-muted-foreground">Total Sessions</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <p className="font-semibold text-green-600">{student.active_sessions}</p>
                              <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last activity: {new Date(student.last_activity).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminView;
