import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { FirebaseService } from '../../providers/firebase';
import { ProfilePage } from '../profile/profile';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
// import { IOSFilePicker } from '@ionic-native/file-picker';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  slides = false;
  album;
  tracks;
  albuns;
  albumt = false;
  record = false;
  //Record audio
  audio: MediaObject;
  playIcon = false;
  pauseIcon = false;
  recording = false;
  public timeLeft;
  timer;
  minutesLabel = "00";
  secondsLabel = "00";
  miLabel = "00"
  totalSeconds = 0;
  mili = 0;
  timer2;
  genero = false;
  fileName;
  filePath;
  generos = [
    { name: 'sertanejo' },
    { name: 'pop' },
    { name: 'funk' },
    { name: 'lounge' },
    { name: 'country' },
    { name: 'rock' },
    { name: 'R&B' },
    { name: 'jazz' },
    { name: 'new age' },
    { name: 'folk' },
    { name: 'eletrônica' },
    { name: 'rap' },
  ];
  generoSelecionado;
  names = false;
  musica;
  playlist = '0';
  carregar;
  pedido = false;
  pedidoConfirm = false;
  fazerUpload = false;
  showSlider = true

  constructor
    (
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform,
    private mediaCapture: MediaCapture,
    private storage: Storage,
    private file: File,
    private media: Media,
    public ngZone: NgZone,
    public firebaseService: FirebaseService,
    public load: LoadingController,
    public fileChooser: FileChooser,
    private filePathPlugin: FilePath,
    // private filePicker: IOSFilePicker
  ) {
    if (this.platform.is('ios')) {
      this.showSlider = false
    }
    let user = JSON.parse(localStorage.getItem('currentUser'))

    this.firebaseService.getAlbuns(user.uid)
      .then((result) => {
        this.albuns = result
      });

    this.timeLeft = new Date()


    let param = this.navParams.get("param");
    if (param === 'slides') {
      this.slides = true
    }
    else if (param === 'album') {
      this.albumt = true
      this.album = this.navParams.get("album");
      this.tracks = this.navParams.get("tracks");
      console.log(this.album, this.tracks)
    }
    else if (param === 'pedido') {
      this.pedido = true
    }
  }

  selectPedido(item) {
    this.generoSelecionado = item.name;
    this.pedido = false;
    this.pedidoConfirm = true;
  }

  ionViewDidLoad() {
    if (this.albumt) {
      let doc = document.getElementsByClassName('scroll-content') as HTMLCollectionOf<HTMLElement>;
      let i = 0;
      for (i; i < doc.length; i++) {
        doc[i].classList.add('bgBlack')
      }

    }

  }

  selectGenero(g) {
    console.log(g)
    this.generoSelecionado = g.name;
    this.genero = false;
    this.names = true
  }

  calculae(vall) {
    var val2 = parseInt(vall).toFixed(0);
    var val = val2.toString()
    var valString = val + "";
    if (valString.length < 2) {
      return 0 + valString;
    } else {
      return valString;
    }
  }

  enviarPedido() {
    let categorie = this.generoSelecionado;
    let user = JSON.parse(localStorage.getItem('currentUser'))
    let uid = user.uid;
    let pedido = {
      categorie: categorie,
      owner: uid,
      status: 'pendente',
      createdAt: new Date()
    };
    this.carregar = this.load.create();
    this.carregar.present()
    this.firebaseService.novoPedido(pedido)
      .then(() => {
        this.carregar.dismiss()
        this.viewCtrl.dismiss()
      })
  }

  enviar() {
    if (!this.fazerUpload) {
      if (
        (this.musica != '') &&
        (this.playlist != '0')
      ) {
        this.carregar = this.load.create();
        this.carregar.present()
        // console.log(this.audio, this.musica, this.playlist, this.g
        let storageRef = firebase.storage().ref();
        let metadata = {
          contentType: 'audio/mp3',
        };

        if (this.platform.is('ios')) {
          let filePath = `${this.file.tempDirectory}` + `${this.fileName}`;
          this.file.readAsDataURL(this.file.tempDirectory, this.fileName).then((file) => {
            let voiceRef = storageRef.child(`records/${this.fileName}`).putString(file, firebase.storage.StringFormat.DATA_URL);
            voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
              console.log("uploading");
            }, (e) => {
              console.log(JSON.stringify(e, null, 2));
            }, () => {
              this.download()
            });
          });
        }
        else if (this.platform.is('android')) {
          let filePath = `${this.file.externalDataDirectory}` + `${this.fileName}`;
          console.log('file', this.file.externalDataDirectory, this.fileName)
          this.file.readAsDataURL(this.file.externalDataDirectory, this.fileName).then((file) => {
            let voiceRef = storageRef.child(`records/${this.fileName}`).putString(file, firebase.storage.StringFormat.DATA_URL);
            voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
              console.log("uploading");
            }, (e) => {
              console.log(JSON.stringify(e, null, 2));
            }, () => {
              this.download()
            });
          });
        }

      }
    }
    else {
      this.download()
    }

  }

  download() {
    let storageRef = firebase.storage().ref();
    storageRef.child(`records/${this.fileName}`).getDownloadURL().then((url) => {
      console.log(url);
      this.sendDatabase(url)
    });
  }

  sendDatabase(url) {
    let user = JSON.parse(localStorage.getItem('currentUser'))

    let data = {
      name: this.musica,
      owner: user.uid,
      preload: 'metadata',
      src: url,
      album: this.playlist,
      categorie: this.generoSelecionado
    }
    console.log(this.albuns, data)
    this.firebaseService.postTrack(data)
      .then(() => {
        this.carregar.dismiss()
        this.viewCtrl.dismiss()
      })
  }

  initRecord() {
    this.slides = false;
    this.record = true;
  }

  selectTrack() {
    this.record = false;
    this.genero = true
  }

  trash() {
    this.minutesLabel = "00";
    this.secondsLabel = "00";
    this.miLabel = "00"
    this.totalSeconds = 0;
    this.mili = 0;
    this.playIcon = false;
    this.pauseIcon = false;
    this.recording = false;
  }

  recordAudio() {

    this.timer = setInterval(() => {
      ++this.totalSeconds;
      this.secondsLabel = this.calculae(this.totalSeconds % 60);
      this.minutesLabel = this.calculae(this.totalSeconds / 60);
    }, 1000);

    this.timer2 = setInterval(() => {
      ++this.mili;
      this.miLabel = this.calculae((this.mili % 60));
    }, 10);

    this.recording = true
    let d = new Date();

    if (this.platform.is('ios')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
      this.filePath = this.file.tempDirectory.replace(/^file:\/\//, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
      this.audio.startRecord()
      console.log(this.fileName, this.filePath)
    } else if (this.platform.is('android')) {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
      this.audio.startRecord()
    }
    // this.file.createFile(this.file.tempDirectory, 'record.m4a', true).then(() => {
    //   this.audio = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'record.m4a');
    //   this.audio.startRecord()
    // })
  }

  // uploadfn() {
  //   this.fileChooser.open().then((url) => {
  //     (<any>window).FilePath.resolveNativePath(url, (result) => {
  //       this.nativepath = result;
  //       this.readimage();
  //     }
  //     )
  //   })
  // }\\

  //Upload audio
  upload() {
    if (this.platform.is('ios')) {
      // this.filePicker.pickFile()
      //   .then((uri) => {
      //     console.log('ios', uri)
      //     this.filePathPlugin.resolveNativePath(uri)
      //       .then((r) => {
      //         console.log(r)
      //         let split = r.split('/');
      //         let le = split.length;
      //         let name = split[le - 1];
      //         console.log(split, le, name)
      //         let l = le - 1;

      //         let i = 0;
      //         let namePath = '';
      //         for (i; i < l; i++) {
      //           namePath = namePath + split[i] + '/';
      //         }

      //         console.log('path', namePath)
      //         this.fileName = name;
      //         this.filePath = r.replace(/^file:\/\//, '');

      //         //Upload
      //         this.carregar = this.load.create();
      //         this.carregar.present()
      //         // console.log(this.audio, this.musica, this.playlist, this.g
      //         let storageRef = firebase.storage().ref();
      //         let metadata = {
      //           contentType: 'audio/mp3',
      //         };

      //         console.log(r, name)
      //         this.file.readAsDataURL(namePath, name).then((file) => {
      //           let voiceRef = storageRef.child(`records/${this.fileName}`).putString(file, firebase.storage.StringFormat.DATA_URL);
      //           voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      //             console.log("uploading");
      //           }, (e) => {
      //             console.log(JSON.stringify(e, null, 2));
      //           }, () => {
      //             console.log('sucesso')
      //             // this.download()
      //             this.genero = true
      //             this.fazerUpload = true
      //           });
      //         });
      //       })
      //       .catch((e) => {
      //         console.log(e)
      //       })
      //   })
    }
    else {
      this.fileChooser.open()
        .then((uri) => {
          console.log(uri)
          this.filePathPlugin.resolveNativePath(uri)
            .then((r) => {
              console.log(r)
              let split = r.split('/');
              let le = split.length;
              let name = split[le - 1];
              console.log(split, le, name)
              let l = le - 1;

              let i = 0;
              let namePath = '';
              for (i; i < l; i++) {
                namePath = namePath + split[i] + '/';
              }

              console.log('path', namePath)
              this.fileName = name;
              this.filePath = r.replace(/file:\/\//g, '');

              //Upload
              this.carregar = this.load.create();
              this.carregar.present()
              // console.log(this.audio, this.musica, this.playlist, this.g
              let storageRef = firebase.storage().ref();
              let metadata = {
                contentType: 'audio/mp3',
              };

              console.log(r, name)
              this.file.readAsDataURL(namePath, name).then((file) => {
                let voiceRef = storageRef.child(`records/${this.fileName}`).putString(file, firebase.storage.StringFormat.DATA_URL);
                voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                  console.log("uploading");
                }, (e) => {
                  console.log(JSON.stringify(e, null, 2));
                }, () => {
                  console.log('sucesso')
                  // this.download()
                  this.genero = true
                  this.fazerUpload = true
                });
              });
            })
            .catch((e) => {
              console.log(e)
            })
        })
    }

  }


  stopRecord() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    this.recording = false
    this.audio.stopRecord()
    this.playIcon = true;
  }

  play() {
    this.playIcon = false
    this.pauseIcon = true;
    this.audio.play();
    console.log(this.totalSeconds)
    let sec = (this.totalSeconds * 1000);
    console.log(sec)

    setTimeout(() => {
      console.log('finish')
      this.pause()
    }, sec)
    // let d = this.audio.getDuration()
    // d = this.audio.getDuration() * 1000
    // console.log(d)
    // if (d > 0) {
    //   console.log(d)
    //   this.playIcon = false
    //   this.pauseIcon = true;

    //   this.audio.play();

    //   setTimeout(() => {
    //     console.log('finish')
    //   }, d)
    // }

  }



  pause() {

    this.pauseIcon = false;
    this.playIcon = true;
    this.audio.pause()
  }


  back() {
    this.viewCtrl.dismiss()
  }

}
