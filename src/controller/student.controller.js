const { v4: uuidv4 } = require("uuid");
const { sendTemplateEmail, sendEmail } = require('../config/email');
const Student = require('../models/students.schema');
const emailTemplates = require("../templates/emailTemplates");

const createStudent = async (req, res) => {
  const { firstName, lastName, email, age } = req.body;

  if (!firstName || !lastName || !email || !age) return res.status(400).json({ message: 'All fields are required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(409).json({ message: 'Student with this email already exists' });

   const emailToken = uuidv4();

    const newStudent = new Student({ firstName, lastName, email, age, emailToken: emailToken });

    await newStudent.save();

    const welcomeTemplate = emailTemplates.welcomeTemplate(firstName, emailToken)
    await sendTemplateEmail(
      email, 
      welcomeTemplate.subject,
      welcomeTemplate.html,
      welcomeTemplate.text,
    );

    res.status(201).json({ message: 'Student created successfully', data: newStudent });
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
}

const verifyEmail = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).json({ message: "No Token" });
  }

  try {
    const student = await Student.findOne({emailToken: token})
    if(!student){
      return res.status(404).json({messsage: "Student With this token doesn't Exist"})
    }
    student.isVerified = true;
    student.emailToken = null;
    await student.save();

    // Send email verification success notification
    // const successTemplate = emailTemplates.emailVerificationSuccessTemplate(user.name);
    // await sendTemplateEmail(
    //   student.email,
    //   successTemplate.subject,
    //   successTemplate.html,
    //   successTemplate.text
    // );

    return res.status(200).json({message: "Student Verified Successfully", student})
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

     const filter = {};
    if (req.query.lastName) {
      filter.lastName = req.query.lastName;
    }

    const students = await Student.find(filter).skip(skip).limit(limit);
    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Students fetched successfully",
      data: students,
      page,
      limit,
      totalPages,
      totalStudents: total
    });
  }
  catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editStudent = async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, email, age } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.email = email || student.email;
    student.age = age || student.age;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const existingStudent = await Student.findOne({ email });
      if (existingStudent && existingStudent._id.toString() !== id) {
        return res.status(409).json({ message: "Student with this email already exists" });
      }

      // If email is changed, mark as unverified
      student.email = email;
      student.isVerified = false;
      
      // Generate new email token for verification
      const emailToken = uuidv4();
      student.emailToken = emailToken;
      
      // Send verification email
      // const welcomeTemplate = emailTemplates.welcomeTemplate(name || user.name, emailToken);
      // await sendTemplateEmail(
      //   email,
      //   welcomeTemplate.subject,
      //   welcomeTemplate.html,
      //   welcomeTemplate.text
      // );
    }

    await student.save();
    await sendEmail(
      student.email,
      'Your Student Information has been Updated',
      `Hello, \n\nYour student information has been updated successfully. \n\n please verify your email with this token ${emailToken}`,
    )
    return res.status(200).json({ message: "Student Updated Successfully" });
  }
  catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json({ message: "Student record deleted successfully" });
  }
  catch (error) {
    console.error("Error deleting student record:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStudentsCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    return res.status(200).json({ message: "Student count fetched successfully", count: count });
  }
  catch (error) {
    console.error("Error fetching student count:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  editStudent,
  deleteStudent,
  getStudentsCount,
  verifyEmail
};