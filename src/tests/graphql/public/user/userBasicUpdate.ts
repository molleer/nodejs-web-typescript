import GenericTestData from '../../../config/GenericTestData';

export default class UserBasicUpdateTest implements GenericTestData {
  resolver() {
    return {
      query: `mutation userBasicUpdate($userID: Int!, $firstName: String!, $lastName: String!) {
        userBasicUpdate(userID: $userID, lastName: $lastName, firstName: $firstName) {
          data {
            userID
            firstName
            lastName
            email
          }
        }
      }`,
      variables: {
        userID: 1,
        firstName: 'Albert',
        lastName: 'Tjornehoj',
      },
    };
  }

  rules() {
    return {
      userBasicUpdate: 'required',
      'userBasicUpdate.data.userID': 'required|integer',
      'userBasicUpdate.data.firstName': 'required|string',
      'userBasicUpdate.data.lastName': 'required|string',
      'userBasicUpdate.data.email': 'required|email',
    };
  }
}