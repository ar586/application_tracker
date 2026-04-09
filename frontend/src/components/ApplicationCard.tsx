import { Draggable } from "@hello-pangea/dnd";
import { formatDistanceToNow } from "date-fns";
import { Building2, Clock, MapPin } from "lucide-react";
import type { IApplication } from "../pages/Dashboard";

interface ApplicationCardProps {
    application: IApplication;
    index: number;
    onClick: () => void;
}

export default function ApplicationCard({ application, index, onClick }: ApplicationCardProps) {
    return (
        <Draggable draggableId={application._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all ${snapshot.isDragging ? "shadow-lg ring-2 ring-indigo-500 bg-indigo-50/10 rotate-2 scale-105 z-50" : ""
                        }`}
                    onClick={onClick}
                >
                    <div className="flex flex-col space-y-2.5">
                        <h3 className="font-semibold text-gray-900 leading-tight">
                            {application.role}
                        </h3>

                        <div className="flex items-center text-sm text-gray-600 space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{application.company}</span>
                        </div>

                        {application.location && (
                            <div className="flex items-center text-xs text-gray-500 space-x-1.5">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                <span className="truncate">{application.location}</span>
                            </div>
                        )}

                        {application.skills && application.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                                {application.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-1.5 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-700 rounded border border-indigo-100"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {application.skills.length > 3 && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded border border-gray-200">
                                        +{application.skills.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500 space-x-1.5 pt-1 border-t border-gray-100">
                            <Clock className="w-3 h-3" />
                            <span>
                                {formatDistanceToNow(new Date(application.dateApplied), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
