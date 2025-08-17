export const DATE_FORMATS = {
  DISPLAY: 'MM/dd/yyyy',
  DISPLAY_WITH_TIME: 'MM/dd/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  TIME_ONLY: 'HH:mm',
  MONTH_YEAR: 'MM/yyyy'
};
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)\.]{10,}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  ZIP_CODE_PATTERN: /^\d{5}(-\d{4})?$/,
  SSN_PATTERN: /^\d{3}-?\d{2}-?\d{4}$/
};
