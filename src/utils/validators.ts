const validateRequiredEmail = (value: string): string | undefined => {
  let error: string | undefined;
  if (!value) {
    error = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = "Invalid email address";
  }
  return error;
};

const validateRequiredPassword = (value: string): string | undefined => {
  let error: string | undefined;
  if (!value) {
    error = "Password is required";
  }
  return error;
};

export { validateRequiredEmail, validateRequiredPassword };
