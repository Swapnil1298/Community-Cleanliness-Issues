export const toAuthUser = (user) => ({
  uid: user._id.toString(),
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  phoneNumber: user.phoneNumber,
  location: user.location,
  emailVerified: user.emailVerified,
  metadata: {
    creationTime: user.createdAt?.toISOString(),
    lastSignInTime: user.lastSignInTime?.toISOString() || user.updatedAt?.toISOString(),
  },
});
