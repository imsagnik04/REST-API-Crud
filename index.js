const express = require('express')
const Joi = require('joi')

const app = express()

app.use(express.json())

//Validation Logic
const validateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course)
}

// Dataset
const courses = [
    {id: 1, name: 'course-1'},
    {id: 2, name: 'course-2'},
    {id: 3, name: 'course-3'},
    {id: 4, name: 'course-4'},
]

//CREATE
app.post('/api/courses', (req,res) => {
    // const result = validateCourse(req.body)

    // Using Object Destructuring
    const { error } = validateCourse(req.body) // === result.error
    if(error)
        return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

// READ
app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('The given id was not found')
    res.send(course)
})

// UPDATE
app.put('/api/courses/:id',(req,res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('The given id was not found')

    // Validate
    // If invalid, return 400- Bad Request
    // const result = validateCourse(req.body)

    const { error } = validateCourse(req.body) // === result.error
    if(error)
        return res.status(400).send(error.details[0].message)

    // Update course
    course.name = req.body.name

    // Return the updated course
    res.send(course)

})

// DELETE
app.delete('/api/courses/:id', (req,res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('The given id was not found')

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index,1)

    // Return the same course
    res.send(course)
})


// app.get('/api/courses',(req,res) => {
//     res.send(courses);
// })

// app.get('/api/posts/:year/:month',(req,res) => {
//     res.send(req.params);
// })


const port = process.env.PORT || 3000

app.listen(port,() => console.log(`Listening on port ${port}`))