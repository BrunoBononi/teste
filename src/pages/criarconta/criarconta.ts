import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase';
import { ProfilePage } from '../profile/profile';
import { Events } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-criarconta',
  templateUrl: 'criarconta.html',
})
export class CriarcontaPage {

  nome = '';
  email = '';
  senha = ''

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public firebaseService: FirebaseService,
    public events: Events,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  criar(){
    let data = {
      email: this.email,
      senha: this.senha,
      nome: this.nome
    }
    let load = this.loadingCtrl.create();

    if(
      (this.email != '') &&
      (this.senha != '') &&
      (this.nome != '')
    ){
      load.present()
      this.firebaseService.newUser(data)
      .then((r) => {
        this.save(r)
        load.dismiss()
      })
    }

  }

  back(){
    this.navCtrl.setRoot(LoginPage)
  }


  save(uid) {
    this.firebaseService.getCurrentUser(uid)
      .then((res) => {
        localStorage.setItem('currentUser', JSON.stringify(res))
        //Go to tabs page
        this.navCtrl.setRoot(ProfilePage);
        this.events.publish('user:created')
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CriarcontaPage');
  }

}
