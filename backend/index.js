
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const axios = require('axios');

const cors = require('cors')
app.use(cors())

dotenv.config();

app.use(express.json())

mongoose.connect('mongodb+srv://amanrao9009:amanrao@cluster0.bw4m5nq.mongodb.net/Master?retryWrites=true&w=majority').then(() => {
    console.log("Mongodb connetec");
}).catch((err) => console.log(err));


app.get("/api",

    (req, res) => {
       

        axios.get('https://gorest.co.in/public/v2/users')
            .then(response => {
                res.send(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }

);

const dataSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    gender: String,
    status: String
});

const Data = mongoose.model('Data', dataSchema);


app.post('/data', (req, res) => {
    const dataArray = req.body;

    const updatePromises = [];

    dataArray.forEach(data => {
        const { id } = data;
        const updatePromise = Data.findOneAndUpdate(
            { id },
            data,
            { upsert: true, new: true }
        );
        updatePromises.push(updatePromise);
    });

    Promise.all(updatePromises)
        .then(savedData => {
            res.status(201).json(savedData);
            console.log('data added')
        })
        .catch(error => {
            res.status(500).json({ error: 'Error saving data' });
        });
});


app.get('/data', (req, res) => {
    Data.find()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(error => {
        res.status(500).json({ error: 'Error retrieving data' });
      });
  });

app.listen(9999, () => {
    console.log("backend start")
})

