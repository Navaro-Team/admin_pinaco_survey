export const validatePhoneNumber = (phoneNumber: string) => {
  const regex = /^0[0-9]{9}$/;
  return regex.test(phoneNumber);
}

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

