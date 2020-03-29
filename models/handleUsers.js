"use strict";
const mon = require("./mongooseWrap");
const bcrypt = require('bcryptjs');                         // added for hashing
const User = require("./User");
const saltTurns = 10;
const dbServer = "localhost";
const dbName = "user";



exports.upsertUser = async function (req) {
    let check = { email: req.body.email };
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltTurns)
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
        return
    } catch(e) {
        console.error(e);
    }
};

exports.getUsers = async function(query, sort) {
    try {
        let cs = await mon.retrieve(dbServer, dbName, User, query, {});
        return cs;
    } catch (e) {
        console.error(e);
    }
};


exports.verifyUser = async function (req) {
    let check = { email: req.body.email };
    let u = await this.getUsers(check, {});
    let success = await bcrypt.compare(req.body.password, u[0].password);
    if (success) {
        console.log("logged in");
        req.session.authenticated = true;       // set session vars
        req.session.user = u[0].firstName;      // set session vars
    } else {
        req.session = undefined;
        console.log("didnt log in");
    }
    console.log(req.session);
    return success;
};