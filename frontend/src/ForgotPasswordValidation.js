function ForgotPasswordValidation(values) {
  let errors = {};
  const email_pattern = /\S+@\S+\.\S+/;
  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/;

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!email_pattern.test(values.email)) {
    errors.email = 'Email format is incorrect';
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!password_pattern.test(values.newPassword)) {
    errors.newPassword =
      'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export default ForgotPasswordValidation;
