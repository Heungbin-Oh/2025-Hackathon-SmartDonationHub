export const TimeSelector = ({ label, value, onChange }) => {
    const generateTimeOptions = () => {
      const options = [];
      for (let hour = 8; hour <= 20; hour++) {
        for (let min = 0; min < 60; min += 15) {
          const h = hour.toString().padStart(2, '0');
          const m = min.toString().padStart(2, '0');
          options.push(`${h}:${m}`);
        }
      }
      return options;
    };
  
    return (
      <div className="space-y-1">
        <label className="block text-gray-700">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        >
          <option value="">Select time</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
    );
  };