import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlbumsPage } from '../albums/albums';
import { TracksPage } from '../tracks/tracks';
import { UploadPage } from '../upload/upload';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})


export class ProfilePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}

export class TabPage {

  albumsPage = AlbumsPage;
  tracksPage = TracksPage;
  uploadPage = UploadPage
}


