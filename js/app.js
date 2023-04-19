import express from 'express';
import { getAllnotes, getNote, createNote } from './database.js';

const app = express()

app.use(express.json())

app.get("/notes", async (req, res) => {
    const note = await getAllnotes()
    res.send(note)
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

app.post("/notes", async (req, res) => {
    const {title, content} = req.body
    const note = await createNote(title, content)
    res.status(201).send(note)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Sth broke!')
})

app.listen(5500, () => {
    console.log('Server is running on port 5000')
})