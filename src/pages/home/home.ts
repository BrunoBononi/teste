import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{ LoginPage } from '../login/login';


@IonicPage()
@Component({ 
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

  }

  //PUSH LOGINPAGE FUNCTION
  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
