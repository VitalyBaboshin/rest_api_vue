const path = require('path');
const {v4} = require('uuid');

// Подключение Express
const express  = require('express');
// Создаем объект приложения
const app = express();

const firebase = require('firebase');
const admin = require("firebase-admin");
const serviceAccount = require("./rest-api-e90ff-firebase-adminsdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
let docRef = db.collection('contacts');

// let CONTACTS = [
//     {id: v4(), name: 'Виталий', value: '+7-911-033-10-10', marked: false}
// ];

app.use(express.json());

// app.get('/api/contacts', (req, res) => {
//     res.status(200).json(CONTACTS);
// });

app.get('/api/contacts', (req, res) => {
    let CONTs = [];
    docRef.get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                CONTs.push(doc.data());
            });
            res.status(200).json(CONTs);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            res.status(520).json(CONTs)
        });
});

app.post('/api/contacts', (req,res) => {
    const contact = {...req.body, id: v4(), marked: false};
    docRef.doc(`${contact.id}`).set(contact);
    res.status(201).json(contact)
});

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
});

// PUT
app.put('/api/contacts/:id', (req, res) => {
    docRef.doc(`${req.params.id}`).set(req.body);
    // const idx = CONTACTS.findIndex(c => c.id === req.params.id);
    // CONTACTS[idx] = req.body;
    res.status(202).json(req.body)
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
    // docRef.get()
    docRef.doc(`${req.params.id}`).delete();
    // CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);
    res.status(200).json({message: 'Контакт был удален'})
});


app.listen(3000, () => console.log('Server has been started on port 3000...'));
