const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.json());

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    "name": "fdsafdfdsafda",
    "number": "afdsafdsa",
    "id": 2
  },
  {
    "name": "fdsafdsaf",
    "number": "dsafdsafdsaf",
    "id": 3
  },
  {
    "name": "fdsafd",
    "number": "fdsaf",
    "id": 5
  }
];

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }
  
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: `${body.name} is already in the phonebook`
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const numppl = persons.length.toString();
  const today = new Date();
  const dateTime = today.toString();
  const respStr = 
    `<div>Phonebook has info of ${numppl} people </div>
     <div>${dateTime}</div>`;
  response.send(respStr);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
