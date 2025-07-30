'use client';
import { useState, useEffect, useRef } from "react";

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

  const yearDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setYearDropdownVisible(false);
      }
    };
    if (yearDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [yearDropdownVisible]);

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
    <div className="relative w-full max-w-xl p-4 rounded-xl border border-border bg-card shadow-xl transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={currentYear === minYear && currentMonth === 0}
          className="text-lg px-2 font-bold hover:text-primary disabled:opacity-50"
        >
          ←
        </button>

        <div className="relative" ref={yearDropdownRef}>
          <h2
            tabIndex={0}
            onClick={() => setYearDropdownVisible(prev => !prev)}
            className="text-lg font-semibold cursor-pointer hover:text-primary focus:outline-none"
          >
            {monthName} {currentYear}
          </h2>

          {yearDropdownVisible && (
            <div className="absolute top-8 right-0 z-50 h-72 overflow-auto w-24 bg-popover dark:bg-[#2a2a2c] shadow-md rounded-md border border-border">
              {yearsArray.map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`p-2 text-center text-sm cursor-pointer rounded-md transition-colors ${
                    year === currentYear
                      ? "bg-primary text-white"
                      : "hover:bg-muted dark:hover:bg-muted/50"
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
          className="text-lg px-2 font-bold hover:text-primary disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-xs font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {daysArray.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className={`h-10 w-full flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium
              ${
                day
                  ? isToday(day)
                    ? "bg-blue-500 text-white"
                    : isSelected(day)
                      ? "bg-emerald-500 text-white"
                      : "bg-muted hover:bg-blue-600 hover:text-white text-foreground"
                  : ""
              }`}
          >
            {day || ""}
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-primary text-accent font-medium rounded-lg hover:bg-primary/90 transition float-right"
        onClick={() => onDateChange(selectedDate)}
      >
        Set Date
      </button>
    </div>
  );
};

export default Calendar;
