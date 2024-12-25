export async function GetReportByUserId(userId) {
  const reportResponse = await fetch(
    "http://localhost:3000/user_reports?userId=" + userId
  );
  const reports = await reportResponse.json();
  // const output = reports.filter((report) => report.user_id == parseInt(userId));
  return reports;
}

export async function GetReportsWithAssignments(userId) {
  try {
    // Fetch data from json-server
    const [assignmentsResponse, reportsResponse] = await Promise.all([
      fetch("http://localhost:3000/studentAssignments?userId=" + userId),
      fetch("http://localhost:3000/reports"),
    ]);

    // Check if responses are OK
    if (!assignmentsResponse.ok || !reportsResponse.ok) {
      throw new Error("Failed to fetch data from server");
    }

    // Parse the JSON data
    const studentAssignments = await assignmentsResponse.json();
    const reports = await reportsResponse.json();

    // Map reports with assignments
    const result = studentAssignments.map((assignment) => {
      const progressReport = reports.find(
        (report) => report.id === assignment.progressReportId
      );
      const finalReport = reports.find(
        (report) => report.id === assignment.finalReportId
      );

      return {
        ...assignment,
        progressReport: progressReport || null,
        finalReport: finalReport || null,
      };
    });

    console.log(result); // Log the mapped data
    return result; // Return the mapped data
  } catch (error) {
    console.error("Error mapping reports with assignments:", error.message);
    throw error; // Rethrow the error for further handling
  }
}

export async function SaveGrade(assignmentId, newGrade, finalFlag) {
  try {
    // Fetch the current assignment data
    const responseAssignments = await fetch(
      `http://localhost:3000/studentAssignments/${assignmentId}`
    );
    if (!responseAssignments.ok) {
      throw new Error("Failed to fetch student assignment.");
    }

    const assignment = await responseAssignments.json();

    // Validate if the assignment exists
    if (!assignment) {
      throw new Error("Student assignment not found.");
    }

    // Prepare the updated assignment data
    const updatedAssignment = { ...assignment, grade: newGrade };
    const updateBody = finalFlag
      ? { gradedStatus: "Graded", grade: newGrade }
      : { grade: newGrade };
    // Perform the PATCH request to update the assignment
    const responseUpdate = await fetch(
      `http://localhost:3000/studentAssignments/${assignmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateBody),
      }
    );

    if (!responseUpdate.ok) {
      throw new Error("Failed to update student assignment grade.");
    }

    const updatedData = await responseUpdate.json();
    console.log("Updated student assignment:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Update failed: " + error.message);
    return error.message;
  }
}

export async function UploadReportDocument(file, reportType, studentAssignmentId) {
  try {
    // Create the report record
    const reportData = {
      name: file.name,
      document: file.content, // Assuming `file.content` contains the file data
      type: reportType,
      time_stamp: new Date().toISOString(),
    };

    const createReportResponse = await fetch("http://localhost:3000/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!createReportResponse.ok) {
      throw new Error("Failed to create report record.");
    }

    const createdReport = await createReportResponse.json();
    console.log("Created report:", createdReport);

    // Fetch the student assignment
    const studentAssignmentResponse = await fetch(
      `http://localhost:3000/studentAssignments/${studentAssignmentId}`
    );

    if (!studentAssignmentResponse.ok) {
      throw new Error("Failed to fetch student assignment.");
    }

    const studentAssignment = await studentAssignmentResponse.json();

    // Update the appropriate field in the student assignment
    const updatedAssignment = {
      ...studentAssignment,
      [`${reportType}ReportId`]: createdReport.id,
      [`${reportType}ReportStatus`]: "Submitted",
    };

    const updateAssignmentResponse = await fetch(
      `http://localhost:3000/studentAssignments/${studentAssignmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAssignment),
      }
    );

    if (!updateAssignmentResponse.ok) {
      throw new Error("Failed to update student assignment.");
    }

    const updatedStudentAssignment = await updateAssignmentResponse.json();
    console.log("Updated student assignment:", updatedStudentAssignment);

    return {
      report: createdReport,
      studentAssignment: updatedStudentAssignment,
    };
  } catch (error) {
    console.error("Error uploading report document:", error.message);
    throw error;
  }
}