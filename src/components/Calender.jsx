'use client';
import { useState, useEffect } from "react";

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ onDateChange }) => {
    const today = new Date();
    const minYear = 1800;
    const maxYear = 2050;

    const [selectedDate, setSelectedDate] = useState(today);
    const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

    const [currentDate, setCurrentDate] = useState({
        month: today.getMonth(),
        year: today.getFullYear(),
    });

    const { month: currentMonth, year: currentYear } = currentDate;

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
    for (let day = 1; day <= daysInMonth; day++) daysArray.push(day);

    const yearsArray = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    const handleYearSelect = (year) => {
        setCurrentDate((prev) => ({ ...prev, year }));
        setYearDropdownVisible(false);

        const validDay = Math.min(selectedDate.getDate(), getDaysInMonth(year, currentMonth));
        setSelectedDate(new Date(year, currentMonth, validDay));
    };

    const handlePrevMonth = () => {
        setCurrentDate((prev) => {
            let newMonth = prev.month - 1;
            let newYear = prev.year;

            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }

            if (newYear < minYear) return prev;
            return { month: newMonth, year: newYear };
        });
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => {
            let newMonth = prev.month + 1;
            let newYear = prev.year;

            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }

            if (newYear > maxYear) return prev;
            return { month: newMonth, year: newYear };
        });
    };

    const handleDayClick = (day) => {
        if (day) {
            const newDate = new Date(currentYear, currentMonth, day);
            setSelectedDate(newDate);
        }
    };

    useEffect(() => {
        const maxDay = getDaysInMonth(currentYear, currentMonth);
        const safeDay = Math.min(selectedDate.getDate(), maxDay);
        setSelectedDate(new Date(currentYear, currentMonth, safeDay));
    }, [currentMonth, currentYear]);

    const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

    const isToday = (day) => {
        const d = new Date();
        return (
            day === d.getDate() &&
            currentMonth === d.getMonth() &&
            currentYear === d.getFullYear()
        );
    };

    const isSelected = (day) => {
        return (
            selectedDate &&
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
        );
    };

    return (
        <div className="relative w-full p-4 bg-white dark:bg-[#1c1c1e] rounded-lg shadow-lg border dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    disabled={currentYear === minYear && currentMonth === 0}
                    className="text-lg px-2 flex-1 disabled:opacity-50"
                >
                    ←
                </button>

                <div className="relative">
                    <h2
                        className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
                        onClick={() => setYearDropdownVisible((prev) => !prev)}
                    >
                        {monthName} {currentYear}
                    </h2>

                    {yearDropdownVisible && (
                        <div className="absolute top-0 right-0 h-[300px] overflow-auto w-[70px] bg-white dark:bg-[#2a2a2c] shadow-lg rounded-lg z-50">
                            {yearsArray.map((year) => (
                                <div
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    className={`p-2 text-sm text-center cursor-pointer transition rounded ${
                                        year === currentYear
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleNextMonth}
                    disabled={currentYear === maxYear && currentMonth === 11}
                    className="text-lg px-2 flex-1 disabled:opacity-50"
                >
                    →
                </button>
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2 text-center">
                {WEEK_DAYS.map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {day}
                    </div>
                ))}

                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`h-10 w-full flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150 ${
                            day
                                ? isToday(day)
                                    ? "bg-blue-500 text-white"
                                    : isSelected(day)
                                        ? "bg-green-500 text-white"
                                        : "text-gray-800 dark:text-white bg-gray-100 dark:bg-[#2a2a2c] hover:bg-blue-500 hover:text-white"
                                : ""
                        }`}
                    >
                        {day || ""}
                    </div>
                ))}
            </div>

            {/* Set Date Button */}
            <button
                className="mt-4 px-4 py-2 float-right bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => onDateChange(selectedDate)}
            >
                Set Date
            </button>
        </div>
    );
};

export default Calendar;

