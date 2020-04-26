
// import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/database'
import * as admin from 'firebase-admin';

const express  = require('express');
const path = require('path');
const {v4} = require('uuid');
const app = express();

// const admin = require('firebase-admin');

// admin.initializeApp({
//     credential: admin.credential.refreshToken(refreshToken),
//     databaseURL: 'https://rest-api-e90f.firebaseio.com'
// });

// firebase.initializeApp({
//     apiKey: "AIzaSyBLzWbOte_9Qc5ZBDlhhwe6mERXLpisKX4",
//     authDomain: "rest-api-e90ff.firebaseapp.com",
//     databaseURL: "https://rest-api-e90ff.firebaseio.com",
//     projectId: "rest-api-e90ff",
//     storageBucket: "rest-api-e90ff.appspot.com",
//     messagingSenderId: "163106349618",
//     appId: "1:163106349618:web:10daacb29460da6f5b522b"
// });

// firebase.auth().onAuthStateChanged(() => {
//
// });

let CONTACTS = [
    {id: v4(), name: 'Виталий', value: '+7-911-033-10-10', marked: false}
];

app.use(express.json());

app.get('/api/contacts', (req, res) => {
    setTimeout(() => {
        res.status(200).json(CONTACTS)
    },1000)

});

app.post('/api/contacts', (req,res) => {
    const contact = {...req.body, id: v4(), marked: false};
    CONTACTS.push(contact);
    res.status(201).json(contact)
});

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);
    res.status(200).json({message: 'Контакт был удален'})
});

// PUT
app.put('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id);
    CONTACTS[idx] = req.body;
    res.json(CONTACTS[idx])
});

app.listen(3000, () => console.log('Server has been started on port 3000...'));
