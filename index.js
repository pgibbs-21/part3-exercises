const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(express.static('dist'));

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const currentDate = new Date();

    res.send(
        `Phonebook has info for ${persons.length} people<br>` +
            `${currentDate.toString()}`
    );
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

const generateId = () => {
    const maxID = (Math.random() * 20000).toFixed(1);
    return maxID;
};

app.post('/api/persons/', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    const nameExists = persons.some((person) => person.name === name);

    if (nameExists) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: generateId(),
        name,
        number,
    };

    persons = persons.concat(newPerson);

    console.log('New person created:', newPerson);

    res.json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
