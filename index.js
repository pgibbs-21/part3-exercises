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

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = person.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons/', async (req, res) => {
    const { name, number } = req.body;

    // Validate that the name and number fields are present
    if (!name || !number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    try {
        // Check if a person with the same name already exists in the database
        const nameExists = await Person.findOne({ name });
        if (nameExists) {
            return res.status(400).json({ error: 'Name must be unique' });
        }

        // Create a new Person instance
        const newPerson = new Person({
            name,
            number,
        });

        // Save the new person to MongoDB
        const savedPerson = await newPerson.save();

        // Send the saved person as a JSON response
        res.json(savedPerson);
    } catch (error) {
        console.error('Error saving person:', error);
        res.status(500).json({
            error: 'An error occurred while saving the person',
        });
    }
});

app.delete('/api/persons/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const person = await Person.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting person', error);
        res.status(404).end();
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
