const express = require('express');
const router = express.Router();
const { getStudents } = require('../mongodb');
const { postStudents } = require('../mongodb');
const { putStudents } = require('../mongodb');
const { deleteStudents } = require('../mongodb');

//#region Get method
/**
 * @swagger
 * /studentsGet:
 *   get:
 *     summary: Returns a greeting message
 *     description: Returns a greeting message "Hello, World!"
 *     responses:
 *       200:
 *         description: A successful response with the greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, World!
 */

router.get('/studentsGet', async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//#endregion

//#region Post method
/**
 * @swagger
 * /studentPost:
 *   post:
 *     summary: Create Student
 *     description: Creates a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student
 *               email:
 *                 type: string
 *                 description: The email of the student
 *               age:
 *                 type: number
 *                 description: The age of the student 
 *     responses:
 *       200:
 *         description: A successful response indicating the student creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 */

router.post('/studentPost', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const students = await postStudents(name, email, age);
    res.status(200).json({ message: 'Student created successfully', students });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(200).json({ message: 'An error occurred, but the request was successful' });
  }
});
//#endregion

//#region Put method
/**
 * @swagger
 * /studentPut/{email}:
 *   put:
 *     summary: Update Student
 *     description: Updates an existing student
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         type: string
 *         description: The email of the student to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student
 *               age:
 *                 type: number
 *                 description: The age of the student
 *     responses:
 *       200:
 *         description: A successful response indicating the update of information about the student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student updated successfully
 *                 student:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The updated name of the student
 *                     age:
 *                       type: number
 *                       description: The updated age of the student
 *       404:
 *         description: The specified student email was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: An error occurred while updating the student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while updating the student
 */ 

router.put('/studentPut/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, age } = req.body;
    const updatedStudent = await putStudents(email, name, age);
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'An error occurred while updating the student' });
  }
});
//#endregion

//#region Delete method
/**
 * @swagger
 * /studentDelete/{email}:
 *   delete:
 *     summary: Delete Student
 *     description: Deletes an existing student
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         type: string
 *         description: The email of the student to delete
 *     responses:
 *       200:
 *         description: A successful response indicating the student deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student deleted successfully
 *       404:
 *         description: The specified student email was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: An error occurred while deleting the student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while deleting the student
 */

router.delete('/studentDelete/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const deletedStudent = await deleteStudents(email);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'An error occurred while deleting the student' });
  }
});
//#endregion

module.exports = router;
