"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface DateRangePickerProps {
    onChange: (range: DateRange) => void;
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: null,
        endDate: null
    });

    const handleDateSelect = (date: Date) => {
        if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
            setDateRange({
                startDate: date,
                endDate: null
            });
        } else {
            if (date >= dateRange.startDate) {
                const newRange = {
                    startDate: dateRange.startDate,
                    endDate: date
                };
                setDateRange(newRange);
                onChange(newRange);
                setIsOpen(false);
            } else {
                setDateRange({
                    startDate: date,
                    endDate: null
                });
            }
        }
    };

    const formatDateRange = () => {
        if (!dateRange.startDate) return "";
        if (!dateRange.endDate) {
            return format(dateRange.startDate, "yyyy-MM-dd");
        }
        return `${format(dateRange.startDate, "yyyy-MM-dd")} - ${format(dateRange.endDate, "yyyy-MM-dd")}`;
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                    value={formatDateRange()}
                    onClick={() => setIsOpen(true)}
                    readOnly
                    className="w-full pr-10 pl-4 py-2 rounded-lg bg-gray-100 text-sm cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-lg z-10">
                    <div className="grid grid-cols-7 gap-1">
                        {/* Calendar header */}
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: 31 }, (_, i) => {
                            const date = new Date(2024, 2, i + 1); // March 2024
                            const isSelected = dateRange.startDate?.getTime() === date.getTime() ||
                                dateRange.endDate?.getTime() === date.getTime();
                            const isInRange = dateRange.startDate && dateRange.endDate &&
                                date >= dateRange.startDate && date <= dateRange.endDate;

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                                        h-8 w-8 rounded-full text-sm
                                        ${isSelected ? "bg-blue-600 text-white" : ""}
                                        ${isInRange ? "bg-blue-100" : ""}
                                        hover:bg-gray-100
                                    `}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
} 