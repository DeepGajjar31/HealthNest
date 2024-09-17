function LoginValidation(values) {
  let error = {};
  const email_pattern = /\S+@\S+\.\S+/;
  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/;

  if (values.email === '') {
    error.email = 'Email cannot be empty';
  } else if (!email_pattern.test(values.email)) {
    error.email = 'Email format is incorrect';
  }

  if (values.password === '') {
    error.password = 'Password cannot be empty';
  } else if (!password_pattern.test(values.password)) {
    error.password =
      'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
  }

  if (values.role === '') {
    error.role = 'Role cannot be empty';
  }

  return error;
}

export default LoginValidation;
