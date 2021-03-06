/* eslint-disable camelcase */
/* eslint-disable no-trailing-spaces */
import express from 'express';
import bcrypt from 'bcrypt';
import Joi from '@hapi/joi';
import client from '../../config/config';


const router = express.Router();

router.post('/signup', (req, res) => {
  // Validate inputs
  const schema = {
    first_name: Joi.string().alphanum().min(3).max(30)
      .required(),
    last_name: Joi.string().alphanum().min(3).max(30)
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
    address: Joi.string().min(3).max(30).required(),
    bio: Joi.string().required(),
    occupation: Joi.string().min(3).max(30).required(),
    expertise: Joi.string().min(3).max(30).required(),
  };

  const result = Joi.validate(req.body, schema);

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    //  if(err) throw err;
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hash,
      address: req.body.address,
      bio: req.body.bio,
      occupation: req.body.occupation,
      expertise: req.body.expertise,
    };
    const user_type = 'mentee';
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [user.email],
    };

    client.query(query).then((results) => {
      if (result.error) {
        res.status(400).json({
          status: 400,
          error: result.error.details[0].message,
        });
      } else if (results.rows && results.rows.length > 0) {
        res.status(409).json({
          status: 409,
          error: 'Email already exists',
        });
      } else {
        client.query('INSERT INTO users(first_name, last_name, email, password, address, bio, occupation, expertise, user_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)', [user.first_name, user.last_name, user.email, user.password, user.address, user.bio, user.occupation, user.expertise, user_type], () => {
          res.status(201).json({
            status: 201,
            message: 'User created successfully',
            data: {
              user: {
                firstName: user.first_name,
                lastName: user.last_name,
              },
            },
          });
        });
      }  
    });  
  });
});

export default router;
