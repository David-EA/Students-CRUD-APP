const Student = require('../models/students.schema');

const createStudent = async (req, res) => {
  const { firstName, lastName, email, age } = req.body;

  if (!firstName || !lastName || !email || !age) return res.status(400).json({ message: 'All fields are required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(409).json({ message: 'Student with this email already exists' });

    const newStudent = new Student({ firstName, lastName, email, age });

    await newStudent.save();

    res.status(201).json({ message: 'Student created successfully', data: newStudent });
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
}

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find().skip(skip).limit(limit);
    const total = await Student.countDocuments();
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
    }

    await student.save();
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
  getStudentsCount
};