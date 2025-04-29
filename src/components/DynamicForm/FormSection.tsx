import React from "react";
import {
  FormSection as FormSectionType,
  FormField as FormFieldType,
} from "../../types";
import FormField from "./FormField";

interface FormSectionProps {
  section: FormSectionType;
  formValues: { [key: string]: string | string[] | boolean };
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  errors: { [key: string]: string | null };
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formValues,
  onChange,
  errors,
  currentSection,
  totalSections,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
        <p className="text-gray-600 mt-1">{section.description}</p>
      </div>

      <div className="space-y-4">
        {section.fields.map((field: FormFieldType) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={
              formValues[field.fieldId] ||
              (field.type === "checkbox" ? false : "")
            }
            onChange={onChange}
            error={errors[field.fieldId] || null}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentSection === 0}
          className={`px-4 py-2 rounded-md ${
            currentSection === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } transition duration-150 ease-in-out`}
        >
          Previous
        </button>

        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSection;
