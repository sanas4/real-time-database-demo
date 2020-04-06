import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firebase: AngularFireDatabase) {
    this.userList = this.firebase.list('users');
  }

  userList: AngularFireList<any>;

  userForm = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    mobile: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  getUsersFromFirebase() {
    return this.userList;
  }

  addAUserToFirebase(user) {
    this.userList.push({
      name: user.name,
      userName: user.userName,
      email: user.email,
      mobile: user.mobile,
    });
  }

  updateAUserOnFirebase(user) {
    this.userList.update(user.$key,
      {
        name: user.name,
        userName: user.userName,
        email: user.email,
        mobile: user.mobile
      });
  }

  deleteAuserFromFirebase($key: string) {
    this.userList.remove($key);
  }
}
