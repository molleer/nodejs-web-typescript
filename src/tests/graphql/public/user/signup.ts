import request from 'supertest';
import { Express } from 'express';

import assertJsonStructureGraphQL from '../../../config/assertJsonStructureGraphQL';
import User from '../../../../db/entities/User';

const signupTest = (app: Express, done: jest.DoneCallback) => {
  const email = 'me@signuptest.com';
  const data = {
    query: `mutation signUp(
      $email: String!,
      $password: String!,
      $password_confirmation: String!,
      $firstName: String!,
      $lastName: String!,
    ) {
      signUp(
        email: $email,
        password: $password,
        password_confirmation: $password_confirmation,
        firstName: $firstName,
        lastName: $lastName,
      ) {
        userID
        firstName
        lastName
        email
      }
    }`,
    variables: {
      email,
      password: '123456At',
      password_confirmation: '123456At',
      firstName: 'Albert',
      lastName: 'Tjornehoj',
    },
  };

  const rules = {
    'signUp.userID': 'required|integer',
    'signUp.firstName': 'required|string',
    'signUp.lastName': 'required|string',
    'signUp.email': 'required|email',
  };

  request(app)
    .post('/graphql/public')
    .send(data)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(async (err, res) => {
      const user = await User.findOne({ where: { email } });
      if (user) {
        await user.remove();
      }
      await assertJsonStructureGraphQL(done, res, err, rules);
    });
};

export default signupTest;
