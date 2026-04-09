import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Sparkles, Copy, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { IApplication } from "../pages/Dashboard";
import { useToast } from "./Toast";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: IApplication | null; // null means we are creating a new one
}

export default function ApplicationModal({ isOpen, onClose, application }: ApplicationModalProps) {
    const { showToast } = useToast();
    const [jdText, setJdText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>({
        defaultValues: {
            company: "",
            role: "",
            status: "Applied",
            jdLink: "",
            notes: "",
            salaryRange: "",
            skills: [],
            location: "",
            seniority: "",
            resumeBullets: [],
        }
    });

    const resumeBullets = watch("resumeBullets");

    useEffect(() => {
        if (application) {
            Object.keys(application).forEach((key) => {
                setValue(key as any, (application as any)[key]);
            });
        } else {
            reset();
            setJdText("");
            setParseError("");
        }
    }, [application, isOpen, setValue, reset]);

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            if (application) {
                return api.put(`/applications/${application._id}`, data);
            } else {
                return api.post("/applications", data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            showToast(application ? "Application updated!" : "Application saved!", "success");
            onClose();
        },
        onError: () => {
            showToast("Failed to save application.", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (application) {
                return api.delete(`/applications/${application._id}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            showToast("Application deleted.", "success");
            onClose();
        },
        onError: () => {
            showToast("Failed to delete application.", "error");
        }
    });

    const handleParseJD = async () => {
        if (!jdText.trim()) {
            setParseError("Please paste a job description first.");
            return;
        }

        setIsParsing(true);
        setParseError("");

        try {
            const response = await api.post("/applications/parse", { jobDescription: jdText });
            const data = response.data;

            // Populate fields
            if (data.company) setValue("company", data.company);
            if (data.role) setValue("role", data.role);
            if (data.location) setValue("location", data.location);
            if (data.seniority) setValue("seniority", data.seniority);
            if (data.salaryRange) setValue("salaryRange", data.salaryRange);
            if (data.skills) setValue("skills", data.skills);
            if (data.resumeBullets) setValue("resumeBullets", data.resumeBullets);

            setJdText("");
            showToast("Job description parsed successfully!", "success");
        } catch (err) {
            console.error(err);
            setParseError("Failed to parse JD. The AI service might be unavailable.");
            showToast("AI parsing failed. Try again.", "error");
        } finally {
            setIsParsing(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm -z-10" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                            {application ? "Application Details" : "New Application"}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto p-6 bg-gray-50/50">
                        {/* AI Parsing Section (Only show when creating new or if specially requested) */}
                        {!application && (
                            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-5 rounded-xl border border-indigo-100 mb-6 shadow-sm">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    <h4 className="font-semibold text-indigo-900">Auto-Fill with AI</h4>
                                </div>
                                <p className="text-sm text-indigo-700 mb-3">Paste the job description below, and we'll extract the details and generate tailored resume bullet points.</p>
                                <textarea
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    className="w-full h-32 p-3 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
                                    placeholder="Paste Job Description here..."
                                />
                                {parseError && <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">{parseError}</p>}
                                <button
                                    type="button"
                                    onClick={handleParseJD}
                                    disabled={isParsing}
                                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                                >
                                    {isParsing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Parsing Details...
                                        </>
                                    ) : "Parse with AI"}
                                </button>
                            </div>
                        )}

                        <form id="app-form" onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company *</label>
                                    <input {...register("company", { required: "Company is required" })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message?.toString()}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role *</label>
                                    <input {...register("role", { required: "Role is required" })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message?.toString()}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select {...register("status")} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        <option value="Applied">Applied</option>
                                        <option value="Phone Screen">Phone Screen</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                                    <input {...register("salaryRange")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input {...register("location")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Target Seniority</label>
                                    <input {...register("seniority")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Mid-level" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Job Link</label>
                                    <input {...register("jdLink")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://..." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Notes (Interview prep, cover letter notes)</label>
                                    <textarea {...register("notes")} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                        </form>

                        {resumeBullets && resumeBullets.length > 0 && (
                            <div className="mt-8">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                    <h4 className="text-lg font-medium text-gray-900">AI Tailored Resume Suggestions</h4>
                                </div>
                                <div className="space-y-3">
                                    {resumeBullets.map((bullet: string, index: number) => (
                                        <div key={index} className="flex group bg-white shadow-sm border border-emerald-100 rounded-lg p-4 transition-all hover:shadow-md hover:border-emerald-300">
                                            <div className="flex-1 pr-4">
                                                <p className="text-sm text-gray-800 leading-relaxed">{bullet}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(bullet, index)}
                                                className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-2 rounded-md transition-all self-start h-9 w-9 flex items-center justify-center"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        <button
                            type="submit"
                            form="app-form"
                            disabled={saveMutation.isPending}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Application"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        >
                            Cancel
                        </button>

                        {application && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this application?")) {
                                        deleteMutation.mutate();
                                    }
                                }}
                                disabled={deleteMutation.isPending}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-100 text-base font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:mr-auto sm:w-auto sm:text-sm transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
