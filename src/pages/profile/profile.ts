import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { AlbumsPage } from '../albums/albums';
import { TracksPage } from '../tracks/tracks';
import { UploadPage } from '../upload/upload';
import { FirebaseService } from '../../providers/firebase';
import { AudioProvider } from 'ionic-audio';
import { ModalPage } from '../modal/modal';
import { PerfilPage } from '../perfil/perfil';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})


export class ProfilePage {

  user;
  tab = "albuns";
  albuns;
  tracks;
  currentTrack;
  image;
  nomeAlbum;
  requests;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseService,
    private _audioProvider: AudioProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    let profile = this.navParams.get('profile');
    if (profile) {
      // this.navCtrl.setRoot(PerfilPage)
      let modal = this.modalCtrl.create(PerfilPage);
      modal.present()

      modal.onDidDismiss(() => {
        this.user = JSON.parse(localStorage.getItem('currentUser'))
      })
    }

    if (this.user.type === 'artista') {
      this.firebaseService.getRequests(this.user.uid)
        .then((result) => {
          this.requests = result
          console.log(this.requests)
        });

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
          console.log(this.albuns)
        });

      this.firebaseService.getTracks(this.user.uid)
        .then((result) => {
          this.tracks = result
          console.log(this.albuns)
        });
    }
  }

  upload() {
    let modal = this.modalCtrl.create(ModalPage, { param: 'slides' });
    modal.present()
    modal.onDidDismiss(() => {
      if (this.user.type === 'artista') {
        this.firebaseService.getRequests(this.user.uid)
          .then((result) => {
            this.requests = result
            console.log(this.requests)
          });

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
            console.log(this.albuns)
          });

        this.firebaseService.getTracks(this.user.uid)
          .then((result) => {
            this.tracks = result
            console.log(this.albuns)
          });
      }
    })
  }

  novoPedido() {
    let modal = this.modalCtrl.create(ModalPage, { param: 'pedido' });
    modal.present()
  }

  playlist(a) {
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
      let load = this.loadingCtrl.create();
      load.present();
      let i = 0;
      let tracks;
      this.firebaseService.getTracksAlbum(a.id)
        .then((r) => {
          load.dismiss();
          tracks = r
          let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: tracks });
          modal.present()
        })
    }

  }

  album(a) {

    let i = 0;
    let tracks = []
    for (i; i < this.tracks.length; i++) {
      if (this.tracks[i].album === a.id) {
        tracks.push(this.tracks[i])
      }
    }
    let modal = this.modalCtrl.create(ModalPage, { param: 'album', album: a, tracks: tracks });
    modal.present()

  }

  novo() {
    let image;
    let array = [
      { image: 'https://images.unsplash.com/photo-1532222846715-0ce690d43830?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4f784a420efbcaeb2f2c824e596df0b9&auto=format&fit=crop&w=2550&q=80' },
      { image: 'https://images.unsplash.com/photo-1531434840235-f8bffa85f0e1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6271a4df27315a8ebcc9f4a5be11bcbe&auto=format&fit=crop&w=1650&q=80' },
      { image: 'https://images.unsplash.com/photo-1531218845464-010db95491c0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=737d7cee90d87ac686e280451830d0eb&auto=format&fit=crop&w=668&q=80' },
      { image: 'https://images.unsplash.com/photo-1531005798731-8449437de73e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c89a1fab168584ee4fc0737c0281f956&auto=format&fit=crop&w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1523958631412-cd125bb67e58?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5db2d9bf033d42dcf542a08d7fa695f1&auto=format&fit=crop&w=1438&q=80' },
      { image: 'https://images.unsplash.com/photo-1497546928067-59f81fcfe560?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e18cf59b9ab8ec6f7792ec3fe77eb5aa&auto=format&fit=crop&w=668&q=80' },
      { image: 'https://images.unsplash.com/photo-1528728935509-22fb14722a30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ff7a6ea0e48954973a5296db5988d9c0&auto=format&fit=crop&w=2520&q=80' },
      { image: 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a2e3abeff94d9a95db8c3b25e84f3718&auto=format&fit=crop&w=1650&q=80' },
      { image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bbaaf356e5f8bb5623631bf7f5f37b91&auto=format&fit=crop&w=1650&q=80' },
      { image: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6fa64120e4c19725806e25c2014ff4e0&auto=format&fit=crop&w=804&q=80' },
    ];
    var item = array[Math.floor(Math.random() * array.length)];
    image = item.image;

    let alert = this.alertCtrl.create({
      title: 'Nome do álbum',
      inputs: [
        {
          name: 'album',
          placeholder: 'Nome'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Próximo',
          handler: data => {
            this.nomeAlbum = data.album;
            this.image = image;
            this.nextAlert()
          }
        }
      ]
    });
    alert.present();
  }

  nextAlert() {
    let alert = this.alertCtrl.create({
      title: 'Estilo musical',
      inputs: [
        {
          type: 'radio',
          label: 'sertanejo',
          value: 'sertanejo',
          checked: true,
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'pop',
          value: 'pop',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'funk',
          value: 'funk',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'lounge',
          value: 'lounge',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'country',
          value: 'country',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'rock',
          value: 'rock',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'R&B',
          value: 'R&B',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'jazz',
          value: 'jazz',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'new age',
          value: 'new age',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'folk',
          value: 'folk',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'eletrônica',
          value: 'eletrônica',
          name: 'ritmo'
        },
        {
          type: 'radio',
          label: 'rap',
          value: 'rap',
          name: 'ritmo'
        },
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Criar',
          handler: data => {
            let load = this.loadingCtrl.create();
            load.present();
            this.firebaseService.newAlbum(this.nomeAlbum, this.user.uid, this.image, data).then((a) => {
              let id = a.id;
              this.firebaseService.updateAlbum(id).then(() => {
                this.firebaseService.getAlbuns(this.user.uid)
                  .then((result) => {
                    this.albuns = result
                    load.dismiss();
                  });
              })
            })
          }
        }
      ]
    });
    alert.present();
  }



}
