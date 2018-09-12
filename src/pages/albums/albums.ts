import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { TracksPage } from '../tracks/tracks';
import { UploadPage } from '../upload/upload';
import { FirebaseService } from '../../providers/firebase';
import { AudioProvider } from 'ionic-audio';
import { ModalPage } from '../modal/modal';

@Component({
  selector: 'page-albums',
  templateUrl: 'albums.html',
})
export class AlbumsPage {

  user;
  tab = "albuns";
  albuns;
  tracks;
  currentTrack;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseService,
    private _audioProvider: AudioProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))

    if (this.user.type === 'artista') {

      this.firebaseService.getAlbunsForArtist(this.user.uid)
        .then((result) => {
          this.albuns = result
          console.log(this.albuns)
        })
    }
    else {
      this.firebaseService.getAlbuns(this.user.uid)
        .then((result) => {
          this.albuns = result


          this.firebaseService.getTracks(this.user.uid)
            .then((result) => {
              this.tracks = result
              console.log(this.albuns)

              let i = 0;
              for (i; i < this.albuns.length; i++) {
                let id = this.albuns[i].id;

                let o = 0;
                for (o; o < this.tracks.length; o++) {
                  if (this.tracks[o].album === id) {
                    this.albuns[i].qnt = this.albuns[i].qnt + 1;
                  }
                }
              }
            });
        });

      // this.firebaseService.getTracks(this.user.uid)
      //   .then((result) => {
      //     this.tracks = result
      //     console.log(this.albuns)
      //   });

    }

    // this.firebaseService.getAlbuns(this.user.uid)
    //   .then((result) => {
    //     this.albuns = result
    //     console.log(this.albuns)
    //   });




  }

  upload() {
    let modal = this.modalCtrl.create(ModalPage, { param: 'slides' });
    modal.present()
  }

  album(a) {
    if (a.type === 'playlist') {
      console.log('p')
      let load = this.loadingCtrl.create();
      load.present();
      this.firebaseService.getRelatedAlbuns(a.id)
        .then((t) => {
          load.dismiss();
          console.log(t)
          let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: t });
          modal.present()
        })
    }
    else {
      let i = 0;
      let tracks = []
      for (i; i < this.tracks.length; i++) {
        if (this.tracks[i].album === a.id) {
          tracks.push(this.tracks[i])
        }
      }
      let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: tracks });
      modal.onDidDismiss(data => {
        this.tab = 'albuns'
      });

      modal.present()
      // let load = this.loadingCtrl.create();
      // load.present();
      // let i = 0;
      // let tracks;
      // this.firebaseService.getTracksAlbum(a.id)
      //   .then((r) => {
      //     load.dismiss();
      //     tracks = r
      //     let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: tracks });
      //     modal.present()
      //   })
    }

  }

  // album(a) {
  //   let i = 0;
  //   let tracks = []
  //   for (i; i < this.tracks.length; i++) {
  //     if (this.tracks[i].album === a.id) {
  //       tracks.push(this.tracks[i])
  //     }
  //   }
  //   let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: tracks });
  //   modal.onDidDismiss(data => {
  //     this.tab = 'albuns'
  //   });

  //   modal.present()


  // }


}
