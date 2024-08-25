const express = require('express'); //Express framework to build apps
const morgan = require('morgan'); //Middleware
const cors = require('cors'); //Middleware
const Person = require('./models/person'); // import Perosn model
// Create an instance of an Express Application
const app = express();

//Middleware to serve static dist file from directory
app.use(express.static('dist'));

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON requests and populate `req.body`
app.use(express.json());

//Middleware to use Morgan to log requests
app.use(morgan('tiny'));

// Log the Note model to verify it's being imported correctly
console.log('Person model:', Person);

app.get('/api/persons', async (req, res) => {
    try {
        const persons = await Person.find({});
        res.json(persons);
    } catch (error) {
        console.error(error);
        response.status(500).json({
            error: 'An error occured while fetching the phonebook',
        });
    }
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
        name,
        number,
    };

    persons = persons.concat(newPerson);

    console.log('New person created:', newPerson);

    res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
