import { useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { Briefcase, Phone, Users, Trophy, XCircle, Plus } from "lucide-react";

// Components
import Column from "../components/Column";
import ApplicationModal from "../components/ApplicationModal";

// Helper Types
export type ApplicationStatus = "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";

export interface IApplication {
    _id: string;
    company: string;
    role: string;
    status: ApplicationStatus;
    dateApplied: string;
    order: number;
    location?: string;
    skills?: string[];
    seniority?: string;
    salaryRange?: string;
    notes?: string;
    jdLink?: string;
    resumeBullets?: string[];
}

const COLUMNS: ApplicationStatus[] = ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"];

const STAT_CONFIG: { key: ApplicationStatus; label: string; icon: React.ElementType; color: string }[] = [
    { key: "Applied", label: "Applied", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    { key: "Phone Screen", label: "Screens", icon: Phone, color: "text-purple-600 bg-purple-50" },
    { key: "Interview", label: "Interviews", icon: Users, color: "text-yellow-600 bg-yellow-50" },
    { key: "Offer", label: "Offers", icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
    { key: "Rejected", label: "Rejected", icon: XCircle, color: "text-red-500 bg-red-50" },
];

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);

    const handleOpenModal = (app?: IApplication) => {
        setSelectedApp(app || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedApp(null), 300);
    };

    const { data: applications = [], isLoading } = useQuery<IApplication[]>({
        queryKey: ["applications"],
        queryFn: async () => {
            const response = await api.get("/applications");
            return response.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, order }: { id: string; status: ApplicationStatus; order: number }) => {
            const response = await api.put(`/applications/${id}`, { status, order });
            return response.data;
        },
        onMutate: async (newApp) => {
            await queryClient.cancelQueries({ queryKey: ["applications"] });
            const previousApps = queryClient.getQueryData(["applications"]);
            queryClient.setQueryData(["applications"], (old: IApplication[] | undefined) => {
                if (!old) return [];
                return old.map((app) =>
                    app._id === newApp.id ? { ...app, status: newApp.status, order: newApp.order } : app
                );
            });
            return { previousApps };
        },
        onError: (_err, _newApp, context) => {
            queryClient.setQueryData(["applications"], context?.previousApps);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        },
    });

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const newStatus = destination.droppableId as ApplicationStatus;
        updateStatusMutation.mutate({ id: draggableId, status: newStatus, order: destination.index });
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Group by status
    const appsByStatus: Record<ApplicationStatus, IApplication[]> = {
        "Applied": [], "Phone Screen": [], "Interview": [], "Offer": [], "Rejected": [],
    };
    applications.forEach((app) => {
        if (appsByStatus[app.status]) appsByStatus[app.status].push(app);
    });
    Object.keys(appsByStatus).forEach((key) => {
        appsByStatus[key as ApplicationStatus].sort((a, b) => a.order - b.order);
    });

    return (
        <div className="h-full flex flex-col pt-4 pb-8 overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{applications.length} application{applications.length !== 1 ? "s" : ""} tracked</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Application
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-5 gap-3 mb-5">
                {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 shadow-sm">
                        <div className={`p-2 rounded-lg ${color}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{appsByStatus[key].length}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto min-h-0 bg-gray-50/50 rounded-xl">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full space-x-4 px-1 pb-4 w-max min-w-full">
                        {COLUMNS.map((status) => (
                            <Column
                                key={status}
                                title={status}
                                applications={appsByStatus[status]}
                                onCardClick={handleOpenModal}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                application={selectedApp}
            />
        </div>
    );
}
