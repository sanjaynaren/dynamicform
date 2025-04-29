import React, { useState, useEffect } from 'react';
import { FormResponse, FormSection as FormSectionType, FormField, FormData } from '../../types';
import FormSection from './FormSection';
import ProgressBar from './ProgressBar';

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const sections = formData.form.sections;
  
  // Handle field change
  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field when it changes
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };
  
  // Validate a single field
  const validateField = (field: FormField, value: string | string[] | boolean): string | null => {
    // For required fields
    if (field.required) {
      if (
        value === '' || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'boolean' && !value)
      ) {
        return field.validation?.message || 'This field is required';
      }
    }
    
    // For text-based fields with length constraints
    if (
      typeof value === 'string' && 
      (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'textarea')
    ) {
      if (field.minLength && value.length < field.minLength) {
        return `Minimum length is ${field.minLength} characters`;
      }
      
      if (field.maxLength && value.length > field.maxLength) {
        return `Maximum length is ${field.maxLength} characters`;
      }
    }
    
    // Email validation
    if (field.type === 'email' && typeof value === 'string' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    // Phone number validation for tel type
    if (field.type === 'tel' && typeof value === 'string' && value) {
      // Basic phone validation - can be customized based on requirements
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    
    return null;
  };
  
  // Validate the current section
  const validateSection = (sectionIndex: number): boolean => {
    const currentFields = sections[sectionIndex].fields;
    let newErrors: { [key: string]: string | null } = {};
    let isValid = true;
    
    currentFields.forEach(field => {
      const value = formValues[field.fieldId] || (field.type === 'checkbox' ? false : '');
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.fieldId] = error;
        isValid = false;
      } else {
        newErrors[field.fieldId] = null;
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };
  
  // Handle next section
  const handleNext = () => {
    if (validateSection(currentSection) && currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      // Scroll to top when changing sections
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous section
  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      // Scroll to top when changing sections
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      console.log('Form Submitted Successfully!');
      console.log('Form Values:', formValues);
      setIsSubmitted(true);
    } else {
      console.log('Form has validation errors. Please correct them before submitting.');
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the form.</p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Form Data (also logged to console):</h3>
            <pre className="text-left text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        {formData.form.formTitle}
      </h1>
      <p className="text-center text-gray-600 mb-6">Form ID: {formData.form.formId} | Version: {formData.form.version}</p>
      
      <ProgressBar 
        currentStep={currentSection + 1} 
        totalSteps={sections.length} 
        sectionTitles={sections.map(section => section.title)}
      />
      
      {sections[currentSection] && (
        <FormSection
          section={sections[currentSection]}
          formValues={formValues}
          onChange={handleFieldChange}
          errors={errors}
          currentSection={currentSection}
          totalSections={sections.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DynamicForm;