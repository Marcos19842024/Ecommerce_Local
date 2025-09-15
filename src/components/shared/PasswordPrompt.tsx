import React, { useState } from 'react';
import { Password } from '../../interfaces/shared.interface';

const PasswordPrompt: React.FC<Password> = ({
  onSuccess,
  message = "Ingrese la contraseña para continuar",
  correctPassword
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      onSuccess();
    } else {
      alert('❌ Contraseña incorrecta');
    }
    
    setPassword('');
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <p className="text-center text-gray-700 mb-4">
        {message}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Escribe la contraseña"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-yellow-500"
          >
            Verificar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordPrompt;