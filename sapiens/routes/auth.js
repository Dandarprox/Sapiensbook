const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');

const ldapjs = require('ldapjs');
const Promise = require('bluebird');
const assert = require('assert');

const express = require('express');
const router = express.Router();

const ldapOptions = {
  url: 'ldap://35.243.152.223:389',
  timeout: 100000,
  connectTimeout: 10000,
  reconnect: true
};

router.post('/', async (req, res) => {
  const ldapClient = ldapjs.createClient(ldapOptions);
  const access = ldapClient.bind(
    'cn = admin, dc = arqsoft, dc = unal, dc = edu, dc = co',
    'admin',
    async function (err) {
      if (err) {
        res.send("No se pudo establecer conexion con LDAP")
      } else {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Correo o contraseña inválidos');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Correo o contraseña inválidos');
        console.log(user.email);
        ldapClient.bind(
          "cn=" + user.email + ",ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co",
          req.body.password,
          function (err) {
            if (err) {
              res.send("El usuario no esta registrado en el directorio LDAP")
            } else {
              const token = user.generateAuthToken();
              res.header('x-auth-token', token).send(token);
              ldapClient.unbind();
            }

          }

        );
      }
    });
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
