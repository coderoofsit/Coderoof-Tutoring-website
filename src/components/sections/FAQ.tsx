import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";

const faqs = [
	{
		question: "What can I expect from the first session?",
		answer:
			"We spend the first 10-15 minutes reviewing your goals, past work, and timelines. The rest of the session is a sample lesson so you leave with a clear study plan and next steps.",
	},
	{
		question: "How should I prepare before we meet?",
		answer:
			"Upload any class notes, assignment prompts, or past exams in the booking form. Jot down specific questions or trouble spots so we can target them from the start.",
	},
	{
		question: "Do you assign homework or follow-up practice?",
		answer:
			"Yes. Every tutoring block ends with tailored practice problems or reading checkpoints. I also add short video or written explanations when a concept needs additional reinforcement.",
	},
	{
		question: "How quickly do you deliver instant question support?",
		answer:
			"Instant support requests are answered within 24 hours. You can choose whether the response arrives as a recorded walkthrough, detailed written solution, or a quick live call.",
	},
	{
		question: "Can we adapt the schedule if my deadlines change?",
		answer:
			"Absolutely. I keep flexible evening and weekend slots open for rush review. Just leave a note in the booking form or email me and we will adjust the cadence immediately.",
	},
	{
		question: "What subjects do you cover beyond the core list?",
		answer:
			"If your topic branches into related math, physics, or chemistry electives, reach out. I review the syllabus first and confirm within a day whether I can take it on or recommend a specialist.",
	},
];

const FAQ = () => {
	return (
		<section
			id="faq"
			className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
		>
			<div className="absolute inset-0 opacity-40">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
				<div className="absolute inset-0 radial-overlay-b"></div>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-14">
					<span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Lightbulb className="h-4 w-4" />
						Common questions
					</span>
					<h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Get clarity on how we work together before you submit the booking form. Each question opens with a quick click and you can always follow up if something is missing.
					</p>
				</div>
				<Accordion type="single" collapsible className="mx-auto max-w-4xl space-y-4">
					{faqs.map((faq, index) => (
						<AccordionItem
							value={`faq-${index}`}
							key={faq.question}
							className="rounded-2xl border border-indigo-100/60 bg-white/90 backdrop-blur-sm px-6"
						>
							<AccordionTrigger className="text-left text-lg font-semibold text-gray-900">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-base text-gray-600 leading-relaxed">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
};

export default FAQ;
