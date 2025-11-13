import { ChangeEvent, FormEvent, ReactNode, RefObject, useMemo, useState } from "react";

import AmericanDatePicker from "@/components/form/AmericanDatePicker";
import FileUploadField from "@/components/form/FileUploadField";
import { Button } from "@/components/ui/button";
import { isValidAmericanDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type SubjectCategory = {
  title: string;
  topics: string[];
};

type AppointmentFormProps = {
  subjects: SubjectCategory[];
  firstFieldRef?: RefObject<HTMLInputElement>;
  variant?: "standalone" | "modal";
};

type FormState = {
  name: string;
  email: string;
  service: "" | "online tutoring" | "assignment help";
  instantHelp: "" | "yes" | "no";
  subject: string;
  topic: string;
  date: string;
  time: string;
  timezone: string;
  notes: string;
};

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const timezones = ["Eastern", "Central", "Mountain", "Pacific"];
const timeOptions = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const SUBTOPIC_PRICE = 30;

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

const AppointmentForm = ({ subjects, firstFieldRef, variant = "standalone" }: AppointmentFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    instantHelp: "",
    subject: "",
    topic: "",
    date: "",
    time: "",
    timezone: "",
    notes: ""
  });
  const [fileError, setFileError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

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
      instantHelp: "",
      subject: prev.subject,
      topic: ""
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setUploadedFileName("");
      setFileError("");
      return true;
    }

    if (file.size > MAX_FILE_BYTES) {
      setFileError("File is larger than 15MB. Please upload a smaller file.");
      setUploadedFileName("");
      return false;
    }

    setFileError("");
    setUploadedFileName(file.name);
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    if (
      !formState.name ||
      !formState.email ||
      !formState.service ||
      !formState.instantHelp ||
      !formState.subject ||
      !formState.topic
    ) {
      setStatusMessage("Please complete all required fields before booking.");
      return;
    }

    if (requiresScheduling && (!formState.date || !formState.time || !formState.timezone)) {
      setStatusMessage("Please choose a date, time, and timezone for your tutoring session.");
      return;
    }

    if (requiresScheduling && !isValidAmericanDate(formState.date)) {
      setStatusMessage("Please enter a valid date in MM/DD/YYYY format.");
      return;
    }

    if (fileError) {
      setStatusMessage("Please resolve the file upload error before submitting.");
      return;
    }

    setStatusMessage("Appointment request received! I will reach out shortly with next steps.");
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
                  Do you need instant help?
                  <select
                    required
                    value={formState.instantHelp}
                    onChange={handleInputChange("instantHelp")}
                    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
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
                      setFormState((prev) => ({ ...prev, topic: "" }));
                    }}
                    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Choose a subtopic</p>
              <div className="mt-4 space-y-3">
                {activeSubject.topics.map((topic, index) => {
                  const inputId = `subtopic-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                  return (
                    <label
                      key={topic}
                      htmlFor={inputId}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                        formState.topic === topic
                          ? "border-indigo-500 bg-white shadow-sm"
                          : "border-indigo-100 bg-white/80 hover:border-indigo-200"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name="subtopic"
                        value={topic}
                        checked={formState.topic === topic}
                        onChange={() => setFormState((prev) => ({ ...prev, topic }))}
                        className="sr-only"
                        required={index === 0 && !formState.topic}
                      />
                      <span className="text-sm font-medium text-gray-800">{topic}</span>
                      <span className="text-sm font-semibold text-indigo-600">${SUBTOPIC_PRICE}</span>
                    </label>
                  );
                })}
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
                description="Attach PDFs, DOCX, or images up to 15MB."
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
            className="w-full self-stretch bg-indigo-600 py-3 text-lg font-semibold text-white hover:bg-indigo-700 md:w-auto md:self-end"
          >
            Book appointment
          </Button>
          {statusMessage && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm font-medium text-indigo-700">
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
