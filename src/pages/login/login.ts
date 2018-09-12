import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CriarcontaPage } from '../criarconta/criarconta';
import { EntrarPage } from '../entrar/entrar';
import { HomePage } from '../home/home';



@Component({ 
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage { 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

  }

  //PUSH CRIARCONTAPAGE FUNCTION
  openCriarcontaPage() {
    this.navCtrl.push(CriarcontaPage);
  }

  saibaMais(){
    this.navCtrl.setRoot(HomePage)
  }

  //PUSH ENTRARPAGE FUNCTION
  openEntrarPage() {
    this.navCtrl.push(EntrarPage);
  }

  entrar(){
    this.navCtrl.setRoot(EntrarPage)
  }

  register(){
    this.navCtrl.setRoot(CriarcontaPage)
  }


}
