export type SiteConfig = {
	name: string;
	tagLine: string;
	contact: {
		email: string;
		phone: string;
	};
	social: {
		facebook?: string;
		twitter?: string;
		linkedin?: string;
		instagram?: string;
	};
	tutor: {
		fullName: string;
		location: string;
		degree: string;
		minors: string;
		university: string;
		experienceYears: number;
		blurbPrimary: string;
		blurbSecondary: string;
	};
};

export const siteConfig: SiteConfig = {
	name: "Nexus",
	tagLine: "One-on-one tutoring for CS, Math, and Data",
	contact: {
		email: "contact@nyccstutor.com",
		phone: "+1 (555) 123-4567",
	},
	social: {
		facebook: "#",
		twitter: "#",
		linkedin: "#",
		instagram: "#",
	},
	tutor: {
			fullName: "Matt Balogh",
		location: "New York",
		degree: "Computer Science",
		minors: "Physics and Statistics",
		university: "New York University (NYU)",
		experienceYears: 10,
		blurbPrimary:
			"I am a New York-based tutor with a degree in Computer Science and minors in Physics and Statistics from New York University (NYU). With over 10 years of tutoring experience, I have helped students master complex topics, improve grades, and prepare effectively for exams.",
		blurbSecondary:
			"I understand that balancing study and work can be challenging — that’s why I offer flexible online sessions, exam help, and personalized support to fit your schedule and learning style.",
	},
};

export default siteConfig;
