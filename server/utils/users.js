
class Users {
  constructor () {
    this.users = [];
  }
  checkIsUserExist(name){
    return this.getUserByName(name);
  }
  addUser (id, name) {
    if (this.caseInsensitiveIndex(name) === -1) {
      var user = {id, name};
      this.users.push(user);
      return user;
    }
  }
  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  getUserByName(name){
    return this.users.find((user) => user.name===name)
  }
  getUserList () {
    var namesArray = this.users;
    return namesArray;
  }
  caseInsensitiveIndex (name) {
    var lowerCaseNames = this.users.map((user) => user.name.toLowerCase());
    return lowerCaseNames.indexOf(name.toLowerCase());
  }
}

module.exports = {Users};
