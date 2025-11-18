import { ChangeEvent, FormEvent, ReactNode, RefObject, useMemo, useRef, useState } from "react";

import AmericanDatePicker from "@/components/form/AmericanDatePicker";
import FileUploadField from "@/components/form/FileUploadField";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isValidAmericanDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { submitAppointmentRequest } from "@/form-data";
import type { AppointmentSubmission } from "@/form-data";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

const SUBTOPIC_PRICE = 30;
const CUSTOM_SUBTOPIC_VALUE = "__custom_subtopic__";
const INSTANT_HELP_PRICE = 20;
const INSTANT_HELP_DESCRIPTION = `Instant help adds a priority review slot so I can look at your request right away and prioritize a fast response.`;

type SubjectCategory = {
  title: string;
  topics: string[];
};

type AppointmentFormProps = {
  subjects: SubjectCategory[];
  firstFieldRef?: RefObject<HTMLInputElement>;
  variant?: "standalone" | "modal";
  onClose?: () => void;
  onSuccess?: () => void;
};

type FormState = {
  name: string;
  email: string;
  service: "" | "online tutoring" | "assignment help";
  instantHelp: "" | "yes" | "no";
  subject: string;
  topic: string;
  topicOther: string;
  date: string;
  time: string;
  timezone: string;
  notes: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  service: "",
  instantHelp: "no",
  subject: "",
  topic: "",
  topicOther: "",
  date: "",
  time: "",
  timezone: "",
  notes: "",
};

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const timezones = ["Eastern", "Central", "Mountain", "Pacific"];

const generateTimeOptions = (startHour = 0, endHour = 23, intervalMinutes = 30) => {
  const options: string[] = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const formattedHour = `${hour}`.padStart(2, "0");
      const formattedMinute = `${minute}`.padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

type FormColumnSpan = 3 | 4 | 6 | 8 | 12;

const columnSpanClasses: Record<FormColumnSpan, string> = {
  3: "w-full md:col-span-3",
  4: "w-full md:col-span-4",
  6: "w-full md:col-span-6",
  8: "w-full md:col-span-8",
  12: "w-full md:col-span-12"
};

type FormRowProps = {
  children: ReactNode;
};

const FormRow = ({ children }: FormRowProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">{children}</div>
);

type FormColumnProps = {
  span?: FormColumnSpan;
  children: ReactNode;
};

const FormColumn = ({ span = 12, children }: FormColumnProps) => (
  <div className={columnSpanClasses[span]}>{children}</div>
);

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

const FormSection = ({ title, children }: FormSectionProps) => (
  <section className="space-y-4">
    <header>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </header>
    <div className="space-y-6">{children}</div>
  </section>
);

const AppointmentForm = ({ subjects, firstFieldRef, variant = "standalone", onClose, onSuccess }: AppointmentFormProps) => {
  const [formState, setFormState] = useState<FormState>(() => ({ ...INITIAL_FORM_STATE }));
  const [fileError, setFileError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [statusVariant, setStatusVariant] = useState<"success" | "error" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const customTopicInputRef = useRef<HTMLInputElement | null>(null);

  const activeSubject = useMemo(
    () => subjects.find((subject) => subject.title === formState.subject),
    [subjects, formState.subject]
  );

  const requiresScheduling = formState.service === "online tutoring";

  const handleInputChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleServiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as FormState["service"];
    setFormState((prev) => ({
      ...prev,
      service: value,
      // Reset scheduling fields when switching away from online tutoring
      date: value === "online tutoring" ? prev.date : "",
      time: value === "online tutoring" ? prev.time : "",
      timezone: value === "online tutoring" ? prev.timezone : "",
      instantHelp: "no",
      subject: prev.subject,
      topic: "",
      topicOther: ""
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setUploadedFileName("");
      setFileError("");
      setAttachment(null);
      return true;
    }

    if (file.size > MAX_FILE_BYTES) {
      setFileError("File is larger than 5MB. Please upload a smaller file.");
      setUploadedFileName("");
      setAttachment(null);
      return false;
    }

    setFileError("");
    setUploadedFileName(file.name);
    setAttachment(file);
    return true;
  };

  const handleTopicSelect = (value: string) => {
    if (value === CUSTOM_SUBTOPIC_VALUE) {
      setFormState((prev) => ({
        ...prev,
        topic: CUSTOM_SUBTOPIC_VALUE,
      }));
      setTimeout(() => customTopicInputRef.current?.focus(), 0);
      return;
    }

    setFormState((prev) => ({
      ...prev,
      topic: value,
      topicOther: "",
    }));
  };

  const handleCustomTopicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({
      ...prev,
      topic: value ? CUSTOM_SUBTOPIC_VALUE : "",
      topicOther: value,
    }));
  };

  const buildSubmissionPayload = (): AppointmentSubmission => ({
    name: formState.name.trim(),
    email: formState.email.trim(),
    service: formState.service as AppointmentSubmission["service"],
    instantHelp: formState.instantHelp as AppointmentSubmission["instantHelp"],
    subject: formState.subject,
    topic: (
      formState.topic === CUSTOM_SUBTOPIC_VALUE || !formState.topic
        ? formState.topicOther
        : formState.topic
    ).trim(),
    date: requiresScheduling ? formState.date : undefined,
    time: requiresScheduling ? formState.time : undefined,
    timezone: requiresScheduling ? formState.timezone : undefined,
    notes: formState.notes,
    attachment,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusVariant(null);

    if (
      !formState.name ||
      !formState.email ||
      !formState.service ||
      !formState.instantHelp ||
      !formState.subject
    ) {
      setStatusVariant("error");
      setStatusMessage("Please complete all required fields before booking.");
      return;
    }

    if (requiresScheduling && (!formState.date || !formState.time || !formState.timezone)) {
      setStatusVariant("error");
      setStatusMessage("Please choose a date, time, and timezone for your tutoring session.");
      return;
    }

    if (requiresScheduling && !isValidAmericanDate(formState.date)) {
      setStatusVariant("error");
      setStatusMessage("Please enter a valid date in MM/DD/YYYY format.");
      return;
    }

    if (fileError) {
      setStatusVariant("error");
      setStatusMessage("Please resolve the file upload error before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitAppointmentRequest(buildSubmissionPayload());
      setFormState(() => ({ ...INITIAL_FORM_STATE }));
      setAttachment(null);
      setUploadedFileName("");
      setFileError("");
      onClose?.();

      const showSubmissionConfirmation = () => {
        if (onSuccess) {
          onSuccess();
          return;
        }

        toast({
          title: "Request submitted",
          description: "Thanks! I'll be in touch shortly with next steps.",
        });
      };

      if (variant === "modal") {
        // Allow the modal close animation to finish before showing confirmation feedback.
        setTimeout(showSubmissionConfirmation, 300);
      } else {
        showSubmissionConfirmation();
      }
    } catch (error) {
      console.error("Appointment submission failed", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "We couldn't send your request right now. Please try again or contact me via email.";
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="booking-form"
      className={cn(
        "mx-auto max-w-4xl rounded-3xl border border-indigo-100/60 bg-white/95 p-8 shadow-xl backdrop-blur-sm",
        variant === "modal" &&
          "max-w-3xl border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn("space-y-10", variant === "modal" && "space-y-8")}
      >
        <FormSection title="Contact information">
          <FormRow>
            <FormColumn span={6}>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Full name
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={handleInputChange("name")}
                  ref={firstFieldRef}
                  className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter your name"
                />
              </label>
            </FormColumn>
            <FormColumn span={6}>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Email address
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange("email")}
                  className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="name@email.com"
                />
              </label>
            </FormColumn>
          </FormRow>
        </FormSection>

        <FormSection title="Session details">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: "online tutoring", label: "Online tutoring" },
              { value: "assignment help", label: "Assignment help" }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${
                  formState.service === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-indigo-100 bg-white hover:border-indigo-200"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={option.value}
                  checked={formState.service === option.value}
                  onChange={handleServiceChange}
                  className="h-4 w-4"
                  required
                />
                <span className="text-base font-medium text-gray-800">{option.label}</span>
              </label>
            ))}
          </div>

          {formState.service && (
            <FormRow>
              <FormColumn span={6}>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>Do you need instant help?</span>
                    <TooltipProvider delayDuration={100}>
                      <Popover>
                        <Tooltip>
                          <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-indigo-500 transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
                                aria-label="What is instant help?"
                              >
                                <Info className="h-3 w-3" aria-hidden="true" />
                                <span className="sr-only">Learn more about instant help</span>
                              </button>
                            </TooltipTrigger>
                          </PopoverTrigger>
                          <TooltipContent side="top" className="max-w-xs text-left">
                            {INSTANT_HELP_DESCRIPTION}
                          </TooltipContent>
                        </Tooltip>
                        <PopoverContent align="start" side="top" className="max-w-xs text-sm leading-relaxed">
                          {INSTANT_HELP_DESCRIPTION}
                        </PopoverContent>
                      </Popover>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={formState.instantHelp || undefined}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, instantHelp: value as FormState["instantHelp"] }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "rounded-xl border bg-white px-4 py-3 text-base font-normal text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                        formState.instantHelp ? "border-indigo-300" : "border-indigo-200",
                      )}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "no", label: "No" as const },
                        { value: "yes", label: "Yes (priority review)" as const, price: INSTANT_HELP_PRICE },
                      ].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex w-full items-center justify-between gap-4">
                            <span>{option.label}</span>
                            {option.price && (
                              <span className="font-semibold text-indigo-500">
                                ${option.price.toFixed(0)}
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </FormColumn>
              <FormColumn span={6}>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Choose a subject
                  <select
                    required
                    value={formState.subject}
                    onChange={(event) => {
                      handleInputChange("subject")(event);
                      setFormState((prev) => ({ ...prev, topic: "", topicOther: "" }));
                    }}
                    className={cn(
                      "rounded-xl border bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                      formState.subject ? "border-indigo-300" : "border-indigo-100"
                    )}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.title} value={subject.title}>
                        {subject.title}
                      </option>
                    ))}
                  </select>
                </label>
              </FormColumn>
            </FormRow>
          )}

            {activeSubject && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6">
                <div className="space-y-4 text-sm font-medium text-gray-700">
                  <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                    <label htmlFor="subtopic-select">Subtopic</label>
                    <Select value={formState.topic || undefined} onValueChange={handleTopicSelect}>
                      <SelectTrigger
                        id="subtopic-select"
                        className={cn(
                          "rounded-xl border bg-white px-4 py-3 text-base font-normal text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                          formState.topic ? "border-indigo-300" : "border-indigo-200"
                        )}
                      >
                        <SelectValue placeholder="Select a subtopic" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {activeSubject.topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            <span className="flex items-center justify-between gap-4">
                              <span>{topic}</span>
                              <span className="font-semibold text-indigo-500">${SUBTOPIC_PRICE}</span>
                            </span>
                          </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM_SUBTOPIC_VALUE}>
                          <span className="flex items-center justify-between gap-4">
                            <span>Other (custom subtopic)</span>
                            
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                    Didn't find your topic? (optional)
                    <div className="relative">
                      <input
                        type="text"
                        value={formState.topicOther}
                        onChange={handleCustomTopicChange}
                        ref={customTopicInputRef}
                        placeholder="Type your topic"
                        className={cn(
                          "w-full rounded-xl border bg-white px-4 py-3 pr-16 text-base font-normal text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                          formState.topicOther ? "border-indigo-300" : "border-indigo-200"
                        )}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-indigo-500">
                        ${SUBTOPIC_PRICE}
                      </span>
                    </div>
                    <span className="text-xs font-normal text-gray-500">
                      We'll reference this custom topic if the dropdown is left blank.
                    </span>
                  </label>
                </div>
              </div>
            )}
        </FormSection>

        {requiresScheduling && (
          <FormSection title="Scheduling preferences">
            <FormRow>
              <FormColumn span={4}>
                <AmericanDatePicker
                  label="Preferred date"
                  value={formState.date}
                  onChange={(value) => setFormState((prev) => ({ ...prev, date: value }))}
                  required
                />
              </FormColumn>
              <FormColumn span={4}>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Preferred time
                  <select
                    required
                    value={formState.time}
                    onChange={handleInputChange("time")}
                    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select a time</option>
                    {timeOptions.map((timeValue) => (
                      <option key={timeValue} value={timeValue}>
                        {timeValue}
                      </option>
                    ))}
                  </select>
                </label>
              </FormColumn>
              <FormColumn span={4}>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Timezone
                  <select
                    required
                    value={formState.timezone}
                    onChange={handleInputChange("timezone")}
                    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select a timezone</option>
                    {timezones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </label>
              </FormColumn>
            </FormRow>
          </FormSection>
        )}

        <FormSection title="Supporting material">
          <FormRow>
            <FormColumn span={12}>
              <FileUploadField
                label="Upload supporting file"
                description="Attach PDFs, DOCX, or images up to 5MB."
                fileName={uploadedFileName}
                error={fileError}
                onFileSelect={handleFileChange}
                onRemove={() => handleFileChange(null)}
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn span={12}>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Additional information (optional)
                <textarea
                  value={formState.notes}
                  onChange={handleInputChange("notes")}
                  className="min-h-[120px] rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Share context, goals, or links"
                />
              </label>
            </FormColumn>
          </FormRow>
        </FormSection>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full self-stretch bg-indigo-600 py-3 text-lg font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-80 md:w-auto md:self-end"
          >
            {isSubmitting ? "Sending..." : "Book appointment"}
          </Button>
          {statusMessage && (
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium",
                statusVariant === "error"
                  ? "border border-red-200 bg-red-50/80 text-red-700"
                  : "border border-emerald-200 bg-emerald-50/80 text-emerald-700",
              )}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
