export async function LoginPost(username, password) {
  try {
    // Fetch the users from the JSON server
    const response = await fetch("http://localhost:3000/users");
    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch users from server.");
    }

    const users = await response.json(); // Parse the JSON response

    // Find a user with the matching username
    const user = users.find((user) => user.username === username);

    // Check if the username and password match
    if (user && user.password === password) {
      // Login successful
      const token = { id: user.id, name: user.username, type: user.role }; // Use user data from server
      return { success: true, token };
    } else {
      // Login failed
      return { success: false, errorMessage: "Invalid username or password." };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during login:", error.message);
    return { success: false, errorMessage: "An error occurred during login." };
  }
}
