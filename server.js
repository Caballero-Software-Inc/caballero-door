'use strict';

require('dotenv').config();
/*Copyright (c) 2015, Scott Motte
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

*/

const recoveryTime = 86400000; // time from one recovery of code to another
const autoSaveTime = 14400000; // time to auto-save
const lKey = 50;/* length of the key */



const appLogin = 'caballerosoftwareinc@gmail.com';
const appPassword = process.env.APPPASSWORD;

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function makeTId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


let tempSeed = makeId(50); // initialization


const express = require('express');
/* 
Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>
Copyright (c) 2013-2014 Roman Shtylman <shtylman+expressjs@gmail.com>
Copyright (c) 2014-2015 Douglas Christopher Wilson <doug@somethingdoug.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/


const nodemailer = require("nodemailer");
/*

Copyright (c) 2011-2019 Andris Reinman
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/

/* Chapter: before interaction */

/* reading the information about the users from the database */
const Datastore = require('nedb');
/* 
Copyright (c) 2013 Louis Chatriot &lt;louis.chatriot@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
*/

const database = new Datastore({ filename: 'database.txt', autoload: true });

let users = [];
database.find({}).exec(function (err, docs) {
    docs.forEach(function (d) {
        users.push(d)
    })
});


/* creating app */
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at ' + port));
app.use(express.static('public'));
app.use(express.json({ limit: '5mb' }));


/* Chapter: new user */

async function sendEmail(emailSubject, firstText, emailAddress, userIdentifier) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: appLogin,
            pass: appPassword // app-password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Caballero Software Inc." <caballerosoftwareinc@gmail.com>', // sender address
        to: emailAddress, // list of receivers
        subject: emailSubject, // Subject line
        text: firstText + userIdentifier, // plain text body
        html: "<b>" + firstText + userIdentifier + "</b>" // html body
    });
}

// new account


app.post('/newaccount', (request, response) => {
    database.find({ email: request.body.email }, function (err, docs) {
        if (docs.length == 0) {
            response.json({ ok: true });
            request.body.identifier = makeId(lKey);
            users.push(request.body);
            autoSave();

            switch (parseInt(request.body.language)) {
                case 0:
                    sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", request.body.email, request.body.identifier);
                    break;
                case 1:
                    sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", request.body.email, request.body.identifier);
                    break;
                default:
                    console.log('Problem in language data.');
                    break;
            };
        } else {
            response.json({ ok: false });
        }
    })
});

app.post('/apiretrieveidentifier', (request, response) => {

    database.find({ email: request.body.email }, function (err, docs) {
        if (docs.length == 0) {
            response.json({ ok: false }) /* email not found */
        } else {
            if (Date.now() - docs[0].recovery > recoveryTime) {
                let j = 0;
                while (j < users.length ? users[j].identifier != docs[0].identifier : false) {
                    j++
                }
                users[j].recovery = Date.now();
                autoSave();
                response.json({ ok: true });
                switch (parseInt(users[j].language)) {
                    case 0:
                        sendEmail("Identifier (Caballero Software Inc.)", "Your identifier for Caballero Software Inc. is: ", request.body.email, docs[0].identifier);
                        break;
                    case 1:
                        sendEmail("Identifiant (Caballero Software Inc.)", "Votre identifiant pour Caballero Software Inc. est : ", request.body.email, docs[0].identifier);
                        break;
                    default:
                        console.log('Problem in language data.');
                        break;
                };

            } else {
                response.json({ ok: false }) /* only after a day, recovery of the identifier is allowed */
            }
        }
    })
});

/* authentication */

app.post('/apiauthentication', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };
    if (j == users.length) {
        response.json({ ok: false }) /* the identifier provided by the user was not found */
    } else {
        if (users[j].email == request.body.email) {
            if (users[j].email == "caballero@caballero.software") {
                response.json({ ok: true, database: users }) /* the identifier provided by the user was found */
            } else {
                response.json({ ok: true, new: (users[j].minor == undefined) }) /* the identifier provided by the user was found */
            }

        } else {
            response.json({ ok: false }) /* the identifier provided by the user was not found */
        }
    }
});

/* delete account */

app.post('/apidelete', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };

    if (users[j].email == request.body.userEmail) {
        users.splice(j, 1);
        response.json({ ok: true });
        autoSave();
    }
});



/* Chapter: save in the dababase */

function autoSave() {
    database.remove({}, { multi: true }, (err, n) => { });
    database.loadDatabase();
    database.insert(users);
    console.log("Update of database, Date.now() = " + Date.now() + ".")
}


/* auto save periodically each 4 hours */
setInterval(autoSave, autoSaveTime);


// Door

app.post('/apiauthenticationservice', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };
    if (j == users.length) {
        response.json({ ok: false }) /* the identifier provided by the user was not found */
    } else {
        if (users[j].email == request.body.userEmail) {
            if (request.body.minor) {
                users[j].minor = true
            } else {
                users[j].minor = false;
                users[j].firstName = request.body.firstName;
                users[j].lastName = request.body.lastName;
                users[j].address = request.body.address;
                users[j].phone = request.body.phone;
                users[j].birth = request.body.birth;
                users[j].sin = request.body.sin;
                users[j].employment = request.body.employment;
                users[j].educational = request.body.educational;
                users[j].web = request.body.web;
                users[j].selfie = request.body.selfie;
            }
            autoSave();
            response.json({ ok: true });
        } else {
            response.json({ ok: false }) /* the identifier provided by the user was not found */
        }
    }
});


/* Caballero|Door */

app.post('/apitiddoor', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].identifier != request.body.userId : false) {
        j++
    };

    if (users[j].email == request.body.userEmail) {
        // users[j]

        let candidate;
        let exptime = 2; //Exponential time for the daltonic demon

        do {
            candidate = makeTId( Math.ceil( Math.log(exptime)/Math.log(34) )  );
            exptime += 1;
        } while ( users.filter(u => u.TId == candidate).length != 0 );

        users[j].TId = candidate;

        response.json({ ok: true, myTId: users[j].TId });
    } else {
        response.json({ ok: false })
    }
});

app.post('/apitiddoordata', (request, response) => {
    let j = 0;
    while (j < users.length ? users[j].TId != request.body.otherTId : false) {
        j++
    };

    if (j == users.length) {
        response.json({ ok: false });
    } else {
        // users[j]
        if (users[j].minor) {
            response.json({ ok: false }); // minors are invisible
        } else {
            response.json({ ok: true, verified: users[j].verified, picture: users[j].selfie, hostility: users[j].hostility });
        }
        
    }
});


app.post('/apiupdatedata', (request, response) => {
    users = request.body.file.split('\n').filter(x => x != '').map(x => JSON.parse(x));
});




