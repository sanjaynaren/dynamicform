import React from "react";
import { FormField as FormFieldType } from "../../types";

interface FormFieldProps {
  field: FormFieldType;
  value: string | string[] | boolean;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  error: string | null;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange(field.fieldId, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.fieldId, e.target.checked);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.fieldId, e.target.value);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: optionValue, checked } = e.target;
    const currentValues = Array.isArray(value) ? value : [];

    if (checked) {
      onChange(field.fieldId, [...currentValues, optionValue]);
    } else {
      onChange(
        field.fieldId,
        currentValues.filter((val) => val !== optionValue)
      );
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return (
          <input
            type={field.type}
            id={field.fieldId}
            value={value as string}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.fieldId}
            value={value as string}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
          />
        );

      case "dropdown":
        return (
          <select
            id={field.fieldId}
            value={value as string}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            data-testid={field.dataTestId}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={(value as string) === option.value}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required={field.required}
                  data-testid={option.dataTestId}
                />
                <label
                  htmlFor={`${field.fieldId}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options) {
          // Multiple checkboxes (multi-select)
          return (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.fieldId}-${option.value}`}
                    name={`${field.fieldId}-${option.value}`}
                    value={option.value}
                    checked={Array.isArray(value)}
                    onChange={handleMultiSelectChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    data-testid={option.dataTestId}
                  />
                  <label
                    htmlFor={`${field.fieldId}-${option.value}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                checked={value as boolean}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                required={field.required}
                data-testid={field.dataTestId}
              />
              <label
                htmlFor={field.fieldId}
                className="ml-2 block text-sm text-gray-700"
              >
                {field.label}
              </label>
            </div>
          );
        }

      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4">
      {field.type !== "checkbox" && (
        <label
          htmlFor={field.fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <p
          className="mt-1 text-sm text-red-600"
          data-testid={`${field.dataTestId}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
