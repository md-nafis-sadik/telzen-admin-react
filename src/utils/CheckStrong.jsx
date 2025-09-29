const checkStrong = (setIsShowIcon, setIsStrong, event) => {
  setIsShowIcon(event.target.value.trim().length > 0);
  const password = event.target.value;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLength = password.length >= 8;
  const hasSpecialSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasLength &&
    hasSpecialSymbol
  ) {
    setIsStrong(true);
  } else {
    setIsStrong(false);
  }
};

export default checkStrong;
