import { Droppable } from "@hello-pangea/dnd";
import ApplicationCard from "./ApplicationCard";
import type { IApplication, ApplicationStatus } from "../pages/Dashboard";
import { BriefcaseIcon } from "lucide-react";

interface ColumnProps {
    title: ApplicationStatus;
    applications: IApplication[];
    onCardClick: (app: IApplication) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
    "Applied": "bg-blue-100 text-blue-800 border-blue-200",
    "Phone Screen": "bg-purple-100 text-purple-800 border-purple-200",
    "Interview": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Offer": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Rejected": "bg-red-100 text-red-800 border-red-200",
};

export default function Column({ title, applications, onCardClick }: ColumnProps) {
    return (
        <div className="flex flex-col w-72 bg-gray-100/80 rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <div className="p-3 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[title]}`}>
                        {title}
                    </span>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {applications.length}
                </span>
            </div>

            <Droppable droppableId={title}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-indigo-50/60" : ""}`}
                    >
                        {applications.length === 0 && !snapshot.isDraggingOver && (
                            <div className="flex flex-col items-center justify-center h-28 text-gray-400">
                                <BriefcaseIcon className="w-6 h-6 mb-2 opacity-40" />
                                <p className="text-xs text-center">Drop cards here</p>
                            </div>
                        )}
                        {applications.map((app, index) => (
                            <ApplicationCard key={app._id} application={app} index={index} onClick={() => onCardClick(app)} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
