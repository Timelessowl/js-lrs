export const paths = {
  login: "/",
  register: "/register",
  confirmRegistration: "/confirm",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  profile: "/profile",
  addPassword: "/add-password",
  changePassword: "/change-password",
  profileSecurity: "/profile?tab=security",
};

export const protectedPaths = [paths.profile, paths.addPassword, paths.changePassword];
