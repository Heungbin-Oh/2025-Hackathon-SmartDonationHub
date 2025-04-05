export const DayPicker = ({ selectedDays, onChange }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
    const toggleDay = (day) => {
      const updatedDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day];
      onChange(updatedDays);
    };
  
    return (
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              selectedDays.includes(day)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    );
  };