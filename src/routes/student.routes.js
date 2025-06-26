const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, editStudent, deleteStudent, getStudentsCount } = require('../controller/student.controller');

router.post('/students', createStudent);
router.get('/students', getAllStudents);
router.put('/students/:id', editStudent);
router.delete('/students/:id', deleteStudent)
router.get('/students/count', getStudentsCount)

module.exports = router;
