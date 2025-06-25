const Student = require ('../models/students.schema');

const createStudent =  async (req, res) => {
    const { firstName, lastName, email, age } = req.body;

    if (!firstName || !lastName || !email || !age) return res.status(400).json({message: 'All fields are required'});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(409).json({ message: 'Student with this email already exists' });

        const newStudent = new Student({ firstName, lastName, email, age });

        await newStudent.save();

        res.status(201).json({ message: 'Student created successfully', data: newStudent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
}

module.exports = {
  createStudent,
};