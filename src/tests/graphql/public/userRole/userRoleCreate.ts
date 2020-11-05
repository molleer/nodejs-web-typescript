import GenericTestData from '../../../config/GenericTestData';
import roles from '../../../../logic/role/role.enum';

export default class UserRoleCreateTest implements GenericTestData {
  async resolver() {
    return {
      query: `mutation userRoleCreate($userID: Int!, $roleID: roles!){
        userRoleCreate(userID: $userID, roleID: $roleID)
      }`,
      variables: {
        roleID: roles.admin,
        userID: 1,
      },
    };
  }

  rules() {
    return {
      userRoleCreate: 'required|string',
    };
  }
}