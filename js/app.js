import express from 'express';
import cors from 'cors';
import { getAllnotes, getNote, createNote, updateNote, deleteNote} from './database.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/notes", async (req, res) => {
    const note = await getAllnotes();
    res.send(note)
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

app.post("/insert", async (req, res) => {
    console.log(req.body);
    const {title, content} = req.body;
    const note = await createNote(title, content);
    res.status(201).send(note);
})

app.post("/update", async (req, res) => {
    console.log(req.body);
    const {id, title, content} = req.body;
    const note = await updateNote(id, title, content);
    res.status(201).send(note);
})

app.post("/delete", async (req, res) => {
    console.log(req.body);
    const {id} = req.body;
    const note = await deleteNote(id);
    res.status(201).send(note);
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Sth broke!')
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT)
})