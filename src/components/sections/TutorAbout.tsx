import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { GraduationCap, MapPin, Award } from "lucide-react";

const TutorAbout = () => {
  const { tutor } = siteConfig;
  const initials = tutor.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">About the Tutor</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">One-on-One, Personalized Tutoring</h2>
        </div>
        <Card className="border border-gray-200">
          <CardContent className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-20 w-20 ring-2 ring-indigo-100">
                <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  I am a <strong>{tutor.location}-based tutor</strong> with a <strong>degree in {tutor.degree} and minors in {tutor.minors} from {tutor.university}</strong>.
                  With over <strong>{tutor.experienceYears}+ years of tutoring experience</strong>, I have helped students master complex topics, improve grades, and prepare effectively for exams.
                </p>
                <p className="text-lg leading-relaxed">
                  I understand that balancing study and work can be challenging - that's why I offer <strong>flexible online sessions</strong>, <strong>exam help</strong>, and <strong>personalized support</strong> to fit your schedule and learning style.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4" /> {tutor.location}</span>
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600"><GraduationCap className="h-4 w-4" /> {tutor.university}</span>
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600"><Award className="h-4 w-4" /> {tutor.experienceYears}+ years</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TutorAbout;
