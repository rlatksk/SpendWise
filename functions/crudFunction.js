function insertUserData(usernameValue, emailValue) {
  usernameValue = usernameValue.toLowerCase();
  if (usernameValue != null && emailValue != null) {
    dummySchema.insertOne({
      username: usernameValue.toString(),
      email: emailValue.toString(),
    });
  } else {
    console.error("Username or email address is null");
  }
}

function deleteUserData(usernameValue) {
  usernameValue = usernameValue.toLowerCase();
  if (usernameValue != null) {
    dummySchema
      .deleteMany({ username: usernameValue })
      .then(() =>
        console.log(
          `User data with username(${usernameValue.toString()}) deleted successfully`
        )
      )
      .catch((err) => console.error("Error deleting data:", err));
  } else {
    console.error("Username is null");
  }
}

function updateUserEmail(usernameValue, oldEmailValue, emailValue) {
  usernameValue = usernameValue.toLowerCase();
  if (usernameValue != null && oldEmailValue != null && emailValue != null) {
    dummySchema
      .updateOne(
        {
          //old email verification
          username: usernameValue,
          email: oldEmailValue,
        },

        { email: emailValue }
      )
      .then(() =>
        console.log(
          `Email address for username(${usernameValue}) has been updated to ${emailValue}`
        )
      )
      .catch((err) => console.error("Error deleting data:", err));
  } else {
    console.error(
      "Email change failed ! (Cannot define old email address or new email address)"
    );
  }
}
