require('dotenv').config;

const Person = require('./models/person')

const express = require('express');
const app = express();
app.use(express.static('build'));

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const morgan = require('morgan');
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformed id' });
  }

  next(error);
}

app.use(errorHandler);

app.delete('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id);
  console.log(id)
  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
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

  const new_person = new Person({
    name: body.name,
    number: body.number,
  });

  new_person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  console.log("asd");
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }
  
  const person = {
    name: body.name,
    number: body.number,
  };
  console.log("asd");
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(person => {
      response.json(person.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});


app.get('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id);
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(person => {
      let numppl = 0;
      person.forEach(person => {
        numppl++;
      });
      const today = new Date();
      const dateTime = today.toString();
      const respStr =
        `<div>Phonebook has info of ${numppl} people </div>
        <div>${dateTime}</div>`;
      response.send(respStr);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
