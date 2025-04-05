import { useNavigate } from "react-router-dom";

export const TrollModal = ({ isOpen }) => {
    const navigate = useNavigate();
    
    const onClose = () =>{
      navigate('/');
    }

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Troll Detected!</h2>
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };