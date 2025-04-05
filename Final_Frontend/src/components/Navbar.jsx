import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-300 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Name */}
        <div
          className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition"
          onClick={() => navigate('/')}
        >
          <img src="/qg.png" alt="QuickGive Logo" className="h-10 w-10 object-contain" />
          <span className="text-white text-2xl font-bold drop-shadow-md">QuickGive</span>
        </div>

        {/* Botón de menú (visible solo en móviles) */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Contenedor de botones */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => navigate('/donator')}
            className="bg-white text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Donate
          </button>
          <button
            onClick={() => navigate('/charity')}
            className="bg-green-500 text-white font-medium px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Charity
          </button>
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col items-center space-y-2">
          <button
            onClick={() => { navigate('/donator'); setIsOpen(false); }}
            className="bg-white text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-700 transition w-full text-center"
          >
            Donate
          </button>
          <button
            onClick={() => { navigate('/charity'); setIsOpen(false); }}
            className="bg-green-500 text-white font-medium px-4 py-2 rounded hover:bg-green-600 transition w-full text-center"
          >
            Charity
          </button>
        </div>
      )}
    </nav>
  );
}