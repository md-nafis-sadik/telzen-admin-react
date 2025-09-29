const showPassword = (setIsShowIcon, event) => {
  setIsShowIcon(event.target.value.trim().length > 0);
};

export default showPassword;
