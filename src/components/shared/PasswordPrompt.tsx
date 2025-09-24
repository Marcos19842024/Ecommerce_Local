import React, { useState } from 'react';
import { password } from '../../server/user';
import { Password } from '../../interfaces/shared.interface';

const PasswordPrompt: React.FC<Password> = ({
  onSuccess,
  message
}) => {
  const [checkPassword, setCheckPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkPassword === password) {
      onSuccess();
    } else {
      alert('❌ Contraseña incorrecta');
    }
    
    setCheckPassword('');
  };

  return (
    <div className="container mx-auto p-2 gap-2 bg-gray-50">
      <p className="text-center text-gray-700 mb-4">
        {message}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-1">
        <input
          type="password"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          placeholder="Escribe la contraseña"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        
        <div className="flex gap-2 px-3 py-2">
          <button
            type="submit"
            className="flex-1 bg-cyan-600 text-white py-2 px-3 rounded-md hover:bg-yellow-500"
          >
            Verificar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordPrompt;