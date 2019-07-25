const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db_user = 'leo';
const len = process.argv.length;
if (!(len === 3 || len === 5)) {
  console.log('Invalid arguments');
  process.exit(1);
}

const password = process.argv[2];
let name;
let number;
if (len === 5) {
  name = process.argv[3];
  number = process.argv[4];
}

const url = `mongodb+srv://${db_user}:${password}@`
            + 'full-stack-open-round-3-plpci.'
            + 'mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
if (len === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number
  });

  person.save().then(response => {
    const strout = `added ${name} number ${number} to phonebook`;
    console.log(strout);
    mongoose.connection.close();
  });
}
