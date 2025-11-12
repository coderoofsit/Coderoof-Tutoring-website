import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, Zap } from "lucide-react";

const services = [
  {
    title: "Online tutoring sessions",
    description:
      "Structured 60–90 minute video sessions focused on the exact concepts you choose. Includes whiteboard walkthroughs, practice problems, and take-home notes.",
    icon: Video,
    highlights: [
      "Live video calls with screen sharing",
      "Session notes delivered after each meeting",
      "Flexible scheduling across time zones",
    ],
  },
  {
    title: "Assignment and project help",
    description:
      "Upload instructions, rubrics, or partially completed work. I review everything, map the approach, and guide you through completing it with confidence.",
    icon: FileText,
    highlights: [
      "Detailed feedback and solution outlines",
      "Support for math, physics, chemistry, and statistics",
      "Document reviews with comments and revisions",
    ],
  },
  {
    title: "Instant question support",
    description:
      "Need help right away? I deliver a response within 24 hours—either a rapid online session or targeted assignment guidance based on what you choose.",
    icon: Zap,
    highlights: [
      "Responses guaranteed within one day",
      "Option for quick live hop-on or annotated solution",
      "Works alongside tutoring or assignment assistance",
    ],
  },
];

const ServicesOverview = () => {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-20"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30" />
        <div className="absolute inset-0 radial-overlay-b" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center space-y-4">
          <Badge className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-1 text-indigo-700">
            Services overview
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">What you can book with me</h2>
          <p className="text-lg text-gray-600">
            Every request fits one of three services—live sessions, assignment support, or instant help. Choose what matches your next step.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map(({ title, description, icon: Icon, highlights }) => (
            <Card key={title} className="h-full border-none bg-white/90 shadow-lg ring-1 ring-indigo-100">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{title}</CardTitle>
                <CardDescription className="text-gray-600">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
