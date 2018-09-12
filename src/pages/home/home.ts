import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import{ LoginPage } from '../login/login';
import { EntrarPage } from '../entrar/entrar';
import { CriarcontaPage } from '../criarconta/criarconta';


@IonicPage()
@Component({ 
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 

  @ViewChild(Slides) slides: Slides;
  showDiv = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {

  }

  back(){
    this.navCtrl.setRoot(LoginPage)
  }

  //PUSH LOGINPAGE FUNCTION
  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  prosseguir(){
    this.navCtrl.setRoot(LoginPage)
  }

  entrar(){
    this.navCtrl.setRoot(EntrarPage)
  }

  register(){
    this.navCtrl.setRoot(CriarcontaPage)
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex === 3){
      this.showDiv = true;
    }
    else {
      this.showDiv = false
    }
  }

}
