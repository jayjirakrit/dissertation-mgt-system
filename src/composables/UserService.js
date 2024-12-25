export async function GetAllUsers() {
  return await fetch("http://localhost:3000/users");
}

export function GetUsers(token) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch users and studentAssignments from json-server
      const [usersResponse, assignmentsResponse] = await Promise.all([
        fetch("http://localhost:3000/users?role=student"),
        fetch("http://localhost:3000/studentAssignments"),
      ]);

      // Check if the responses are OK
      if (!usersResponse.ok || !assignmentsResponse.ok) {
        throw new Error("Failed to fetch data from server");
      }

      // Parse the JSON data
      const usersData = await usersResponse.json();
      const assignmentsData = await assignmentsResponse.json();
      const filterUser =
        token.type === "teacher"
          ? usersData.filter((userData) => userData.teacherId === token.id)
          : usersData;
      // Merge users with their corresponding studentAssignments
      const result = filterUser.map((user) => {
        const assignment = assignmentsData.find(
          (assignment) => assignment.userId === user.id
        );

        return {
          ...user,
          ...assignment, // Merge fields from assignment if it exists
        };
      });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

export async function CreateUserDemo(userInput, studentAssignment) {
  try {
    // Fetch existing users to check for duplicate usernames
    const responseUsers = await fetch("http://localhost:3000/users");
    if (!responseUsers.ok) {
      throw new Error("Failed to fetch users.");
    }

    const users = await responseUsers.json();

    // Check if the username exists
    const userExists = users.some(
      (user) => user.username === userInput.username
    );
    if (userExists) {
      throw new Error("Username is already taken");
    }

    // Add type "student" to the user input
    const newUserInput = { ...userInput, type: "student" };

    // Create the user
    const responseCreateUser = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInput),
    });

    if (!responseCreateUser.ok) {
      throw new Error("Failed to create user.");
    }

    const createdUser = await responseCreateUser.json();
    console.log("Created user:", createdUser);

    // Attach the user ID to the studentAssignment
    const newStudentAssignment = {
      ...studentAssignment,
      userId: createdUser.id,
    };

    // Create the student assignment
    const responseStudentAssignment = await fetch(
      "http://localhost:3000/studentAssignments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudentAssignment),
      }
    );

    if (!responseStudentAssignment.ok) {
      // If creating the assignment fails, delete the user
      await fetch(`http://localhost:3000/users/${createdUser.id}`, {
        method: "DELETE",
      });
      throw new Error(
        "Failed to create student assignment. User creation reverted."
      );
    }

    const createdStudentAssignment = await responseStudentAssignment.json();
    console.log("Created student assignment:", createdStudentAssignment);

    // Return both the created user and assignment
    return { user: createdUser, studentAssignment: createdStudentAssignment };
  } catch (error) {
    console.error("Error:", error.message);
    return { error: error.message };
  }
}

export async function CreateUser(userInput, studentAssignment) {
  try {
    const responseUsers = await fetch("http://localhost:3000/users");
    if (!responseUsers.ok) {
      throw new Error("Failed to fetch users.");
    }

    const users = await responseUsers.json();

    // Check if the username exists
    const userExists = users.some(
      (user) => user.username === userInput.username
    );
    if (userExists) {
      throw new Error("Username is already taken");
    }

    const newUserInput = { ...userInput, type: "student" };
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInput),
    });

    if (!response.ok) {
      throw new Error("Failed to create user.");
    }

    const data = await response.json();
    console.log("Created user:", data);
    return data;
  } catch (error) {
    console.error("Created user failed " + error.message);
    return error.message;
  }
}
