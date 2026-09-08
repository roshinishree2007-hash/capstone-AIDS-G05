package com.ailab.reservation.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDTO {

    @NotBlank(message = "Student roll number is required")
    private String rollNumber;

    @NotBlank(message = "Student full name is required")
    private String studentName;

    @NotBlank(message = "Student email is required")
    @Email(message = "A valid college email address is required")
    private String email;

    private String department = "Artificial Intelligence & Data Science";

    private Integer semester = 4;

    @NotNull(message = "Workstation ID is required")
    private Long workstationId;

    @NotNull(message = "Reservation date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Project title is required")
    @Size(max = 150, message = "Project title cannot exceed 150 characters")
    private String projectTitle;

    @NotBlank(message = "Model or framework details are required")
    @Size(max = 100, message = "Model / Framework cannot exceed 100 characters")
    private String modelFramework;

    public BookingRequestDTO() {
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Long getWorkstationId() {
        return workstationId;
    }

    public void setWorkstationId(Long workstationId) {
        this.workstationId = workstationId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getModelFramework() {
        return modelFramework;
    }

    public void setModelFramework(String modelFramework) {
        this.modelFramework = modelFramework;
    }
}
