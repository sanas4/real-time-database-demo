import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {IUser} from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: IUser[];

  constructor(private userService: UserService) {
  }

  submitted: boolean;
  showDeletedMessage: boolean;
  formControls = this.userService.userForm.controls;

  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit() {
    this.submitted = true;
    if (this.userService.userForm.valid) {
      if (this.userService.userForm.get('$key').value == null) {
        this.userService.addAUserToFirebase(this.userService.userForm.value);
        this.userService.userForm.reset();
      } else {
        this.userService.updateAUserOnFirebase(this.userService.userForm.value);
      }
    }
  }

  getUsers() {
    this.userService.getUsersFromFirebase().snapshotChanges().forEach(usersSnapShot => {
      this.userList = [];
      usersSnapShot.forEach(userSnapshot => {
        let user = userSnapshot.payload.toJSON();
        user['$key'] = userSnapshot.key;
        this.userList.push(user as IUser);
      });
    });
  }

  deleteUser($key) {
    if (confirm('Are you sure to delete this record ?')) {
      this.userService.deleteAuserFromFirebase($key);
      this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  }

  populateForm(user) {
    this.userService.userForm.setValue(user);
  }
}
