const mongoose = require('mongoose');

// const username = "appuser";
// const password = encodeURIComponent("feGaZK1aF7pludJj");
// const hostname = "cluster0.k4c8jx7.mongodb.net";

// mongoose.connect(`mongodb+svr://${username}:${password}@${hostname}/?retryWrites=true&w=majority`)
//   .then(() => console.log('Connected!'))
//   .catch(() => console.log('Connection failed'));

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());

app.get('/subscriber', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.send("Invalid email provided")
  }
  console.log(email);
  await initMongoose();
  const record = await getSubscriber(email);
  // console.log(record)

  if (!record) {
    return res.send("Email not subscribed")
  } else {
    res.send(`Hello ${record.name}, you are already subscribed`)
  }
});

app.post('/subscriber', async (req, res) => {
  const formData = req.body;
  console.log(formData);
  await initMongoose();
  addSubscriber(formData.name, formData.email)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let SubscriberModel;

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Subscriber = new Schema({
  id: ObjectId,
  name: String,
  email: String,
  date: { type: Date, default: Date.now },
});

function initMongoose() {
  const conn = mongoose.connect('mongodb://127.0.0.1:27017/myapp')
    .then(() => console.log('Connected!'))
    .catch(() => console.log('Connection failed'));




  SubscriberModel = mongoose.model('Subscriber', Subscriber);

  return SubscriberModel;
}

function addSubscriber(name, email) {
  SubscriberModel.create({
    name,
    email
  }).then(() => console.log('added'));
}

function getSubscriber(email) {
  return SubscriberModel.findOne({ email }).exec();
}

// conn.then(() => {
//   console.log('ready to write..');

//   // addSubscriber("Oluchukwu Edeh", "oluchi@gmail.com");
//   getSubscriber("oluchi@gmail.com").then((res) => console.log(res));
// })