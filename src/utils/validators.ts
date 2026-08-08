const validateRequiredEmail = (value: string): string | undefined => {
  let error: string | undefined;
  if (!value) {
    error = "Email address is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
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
