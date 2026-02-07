export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationRules {
  [key: string]: Array<(value: unknown) => string | null>;
}

/**
 * Common validators
 */
export const validators = {
  // Required field validator
  required: (fieldName = "This field"): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value || (typeof value === "string" && !value.trim())) {
        return `${fieldName} is required`;
      }
      return null;
    };
  },

  // Email validator
  email: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return "Please enter a valid email address";
      }
      return null;
    };
  },

  // Min length validator
  minLength: (min: number): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value || String(value).length < min) {
        return `Must be at least ${min} characters`;
      }
      return null;
    };
  },

  // Max length validator
  maxLength: (max: number): ((value: unknown) => string | null) => {
    return (value) => {
      if (value && String(value).length > max) {
        return `Must be no more than ${max} characters`;
      }
      return null;
    };
  },

  // Pattern validator
  pattern: (
    pattern: RegExp,
    message: string
  ): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value || !pattern.test(String(value))) {
        return message;
      }
      return null;
    };
  },

  // URL validator
  url: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      try {
        new URL(String(value));
        return null;
      } catch {
        return "Please enter a valid URL";
      }
    };
  },

  // Number validator
  number: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      if (isNaN(Number(value))) {
        return "Must be a valid number";
      }
      return null;
    };
  },

  // Min value validator
  min: (min: number): ((value: unknown) => string | null) => {
    return (value) => {
      if (value !== null && value !== undefined && Number(value) < min) {
        return `Must be at least ${min}`;
      }
      return null;
    };
  },

  // Max value validator
  max: (max: number): ((value: unknown) => string | null) => {
    return (value) => {
      if (value !== null && value !== undefined && Number(value) > max) {
        return `Must be no more than ${max}`;
      }
      return null;
    };
  },

  // Match validator (e.g., password confirmation)
  match: (
    compareValue: unknown,
    fieldName: string
  ): ((value: unknown) => string | null) => {
    return (value) => {
      if (value !== compareValue) {
        return `Does not match ${fieldName}`;
      }
      return null;
    };
  },

  // Phone number validator
  phone: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(String(value).replace(/\s/g, ""))) {
        return "Please enter a valid phone number";
      }
      return null;
    };
  },

  // Postal code validator
  postalCode: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      const postalRegex = /^[A-Z0-9]{3,10}$/i;
      if (!postalRegex.test(String(value).replace(/\s/g, ""))) {
        return "Please enter a valid postal code";
      }
      return null;
    };
  },

  // Credit card validator (basic Luhn algorithm)
  creditCard: (): ((value: unknown) => string | null) => {
    return (value) => {
      if (!value) return null;
      const cardNumber = String(value).replace(/\s/g, "");
      if (!/^[0-9]{13,19}$/.test(cardNumber)) {
        return "Please enter a valid credit card number";
      }
      // Luhn algorithm
      let sum = 0;
      let isEven = false;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        isEven = !isEven;
      }
      if (sum % 10 !== 0) {
        return "Invalid credit card number";
      }
      return null;
    };
  },

  // Custom validator function
  custom: (
    fn: (value: unknown) => string | null
  ): ((value: unknown) => string | null) => {
    return fn;
  },
};

/**
 * Validate form data against rules
 */
export function validateForm(
  data: Record<string, unknown>,
  rules: ValidationRules
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    for (const validator of fieldRules) {
      const error = validator(value);
      if (error) {
        errors.push({
          field,
          message: error,
        });
        break; // Stop at first error for this field
      }
    }
  }

  return errors;
}

/**
 * Check if form has errors
 */
export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

/**
 * Get error for specific field
 */
export function getFieldError(
  errors: ValidationError[],
  field: string
): string | null {
  return errors.find((e) => e.field === field)?.message || null;
}

/**
 * Common form validation schemas
 */
export const validationSchemas = {
  contact: {
    name: [validators.required("Name"), validators.minLength(2)],
    email: [validators.required("Email"), validators.email()],
    message: [validators.required("Message"), validators.minLength(10)],
  },

  newsletter: {
    email: [validators.required("Email"), validators.email()],
  },

  login: {
    email: [validators.required("Email"), validators.email()],
    password: [validators.required("Password"), validators.minLength(6)],
  },

  register: {
    name: [validators.required("Name"), validators.minLength(2)],
    email: [validators.required("Email"), validators.email()],
    password: [
      validators.required("Password"),
      validators.minLength(8),
      validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    ],
    confirmPassword: [validators.required("Confirm Password")],
  },

  checkout: {
    email: [validators.required("Email"), validators.email()],
    firstName: [validators.required("First Name")],
    lastName: [validators.required("Last Name")],
    address: [validators.required("Address")],
    city: [validators.required("City")],
    postalCode: [validators.required("Postal Code"), validators.postalCode()],
    phone: [validators.required("Phone"), validators.phone()],
  },

  productReview: {
    rating: [validators.required("Rating"), validators.min(1), validators.max(5)],
    title: [validators.required("Title"), validators.minLength(5)],
    comment: [validators.required("Review"), validators.minLength(20)],
  },
};
