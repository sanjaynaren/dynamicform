import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import DynamicForm from './components/DynamicForm';
import { UserRegistration, FormResponse } from './types';
import { getForm } from './api';
import { ChevronRight } from 'lucide-react';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<UserRegistration | null>(null);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationSuccess = async (data: UserRegistration) => {
    setUserData(data);
    setLoading(true);
    setError(null);
    
    try {
      const form = await getForm(data.rollNumber);
      
      if (form) {
        setFormData(form);
        setIsRegistered(true);
      } else {
        setError('Failed to fetch form data. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dynamic Form Application</h1>
            {userData && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{userData.name}</span> | Roll: {userData.rollNumber}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!isRegistered ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to the Dynamic Form Application</h2>
              
            </div>
            
            {error && (
              <div className="max-w-md mx-auto mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="max-w-md mx-auto text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                <p className="text-gray-700">Loading your form...</p>
              </div>
            ) : (
              <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
            )}
            
            <div className="mt-12 max-w-3xl mx-auto">
             
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                       
                      </div>
                      
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                       
                      </div>
                      <div className="ml-3">
                        
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        
                      </div>
                      <div className="ml-3">
                        
                        <p className="mt-1 text-sm text-gray-500"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          formData && <DynamicForm formData={formData} />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;