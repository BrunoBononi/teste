import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase';
import { ProfilePage } from '../profile/profile';
import { Events } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-entrar',
  templateUrl: 'entrar.html',
})
export class EntrarPage {

  email = '';
  password = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseService,
    public events: Events,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  login() {
    if (
      (this.email != '')
      && (this.password != '')
    ) {
      let load = this.loadingCtrl.create();
      load.present()
      this.firebaseService.login(this.email, this.password)
        .then((res) => {
          console.log(res)
          load.dismiss()
          this.save(res.uid)
        })
        .catch((err) => {
          load.dismiss()
          console.log(err)
          if (err.code === 'auth/wrong-password') {
            let toast = this.toastCtrl.create({
              message: 'Ops. Essa senha está incorreta.',
              duration: 2000,
            });
            toast.present();
          }
          else if (err.code === 'auth/user-not-found') {
            let toast = this.toastCtrl.create({
              message: 'Ops. Esse usuário não existe.',
              duration: 2000,
            });
            toast.present();
          }
          else if (err.code === 'auth/invalid-email') {
            let toast = this.toastCtrl.create({
              message: 'Ops. Digite corretamente seu e-mail .',
              duration: 2000,
            });
            toast.present();
          }
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

  forgot() {
    if (this.email != '') {
      let load = this.loadingCtrl.create();
      load.present()
      this.firebaseService.forgot(this.email)
        .then((res) => {
          load.dismiss()
          let toast = this.toastCtrl.create({
            message: 'Por favor, verifique seu e-mail.',
            duration: 2000,
          });
          toast.present();
        })
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Por favor, preencha seu e-mail.',
        duration: 2000,
      });
      toast.present();
    }

  }

}
