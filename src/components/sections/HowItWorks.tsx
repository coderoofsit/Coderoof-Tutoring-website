import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarCheck, ClipboardList, MailCheck } from "lucide-react";

const steps = [
  {
    title: "Submit your request",
    description: "Complete the booking form, pick the service you need, and choose the timing that fits your schedule.",
    icon: CalendarCheck,
    highlight: "Step 01",
  },
  {
    title: "I review and prepare",
    description: "I check your information, clarify any details if needed, and map the best approach for your goals.",
    icon: ClipboardList,
    highlight: "Step 02",
  },
  {
    title: "Receive confirmation",
    description: "You get a confirmation email with next steps so we can start delivering the tutoring or assignment support.",
    icon: MailCheck,
    highlight: "Step 03",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/50 py-20"
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-purple-100/20" />
        <div className="absolute inset-0 radial-overlay-b" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">How it works</h2>
          <p className="text-lg text-gray-600">
            Submit your booking, I confirm the plan, and you get everything you need to begin confidently.
          </p>
        </header>

        <div className="flex flex-col gap-6 md:flex-row">
          {steps.map(({ title, description, icon: Icon, highlight }) => (
            <Card
              key={title}
              className={cn(
                "relative flex-1 border-none bg-white/90 shadow-lg ring-1 ring-indigo-100 transition hover:shadow-xl",
              )}
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wide text-indigo-600">
                    {highlight}
                  </Badge>
                  <CardTitle className="mt-2 text-xl text-gray-900">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
