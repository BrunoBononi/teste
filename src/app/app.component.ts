import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, ModalController, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { ModalPage } from '../pages/modal/modal';
import { AlbumsPage } from '../pages/albums/albums';
import { Events } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { FirebaseService } from '../providers/firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  user;
  comp = false;
  @ViewChild(Nav) nav: Nav;

  constructor(private firebaseService: FirebaseService,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public modalController: ModalController, public events: Events, public menu: MenuController) {
    let item = localStorage.getItem('currentUser');
    if (item) {
      this.user = JSON.parse(localStorage.getItem('currentUser'))
      if(this.user.type === 'compositor'){
        this.comp = true
      }

      //Update user data
      this.firebaseService.getCurrentUser(this.user.uid)
        .then((res) => {
          localStorage.setItem('currentUser', JSON.stringify(res))
        })

      this.rootPage = ProfilePage;
    }
    else {
      this.rootPage = LoginPage
    }

    events.subscribe('user:created', (user, time) => {
      let item = localStorage.getItem('currentUser');
      if (item) {
        this.user = JSON.parse(localStorage.getItem('currentUser'))
        if(this.user.type === 'compositor'){
          this.comp = true
        }
        this.rootPage = ProfilePage
      }
      else {
        this.rootPage = LoginPage
      }
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      });
    });
  }

  logout() {
    localStorage.clear();
    this.nav.setRoot(LoginPage)
    this.menu.close()
  }

  profile() {
    this.nav.setRoot(ProfilePage, { profile: true })
    this.menu.close()
  }
  uploads() {
    let m = this.modalController.create(ModalPage, { param: 'slides' })
    m.present()
    this.menu.close()
  }
  albuns() {
    this.nav.setRoot(AlbumsPage)
    this.menu.close()
  }


}


