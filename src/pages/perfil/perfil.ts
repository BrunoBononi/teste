import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { FirebaseService } from '../../providers/firebase';
import { Camera } from '@ionic-native/camera';
import { ImagesUpload } from '../../providers/images-upload';

@IonicPage()
@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html',
})
export class PerfilPage {

    user;
    edit = false;
    bigImg = null;
    smallImg = null;
    editPhoto = false;
    imageUpload;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public loadingCtrl: LoadingController,
        public firebaseService: FirebaseService,
        private camera: Camera,
        private storageImages: ImagesUpload,
    ) {
        this.user = JSON.parse(localStorage.getItem('currentUser'))
    }

    enableEdit() {
        this.edit = true
    }

    save() {
        let load = this.loadingCtrl.create();
        load.present();
        this.firebaseService.saveUser(this.user)
            .then(() => {
                localStorage.setItem('currentUser', JSON.stringify(this.user))
                load.dismiss();
                this.edit = false
            })
    }

    back() {
        this.viewCtrl.dismiss()
    }

    pegarFoto() {
        this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            allowEdit: true,
            targetWidth: 500,
            targetHeight: 500
        }).then(imageData => {
            let base64data = 'data:image/jpeg;base64,' + imageData;
            this.bigImg = base64data;
            //Get image size
            this.createThumbnail();
        }, error => {
        });
    }

    createThumbnail() {
        let load = this.loadingCtrl.create();
        load.present()

        this.generateFromImage(this.bigImg, 1000, 1000, 100, data => {
            this.smallImg = data;
            let imgToUp = this.smallImg.split(',')[1];
            // console.log(imgToUp);
            this.storageImages.uploadPhoto(imgToUp, this.user.uid, 'Profile')
                .then((savedPicture) => {
                    console.log(savedPicture)
                    this.user.avatar = savedPicture.downloadURL;
                    this.firebaseService.saveUser(this.user)
                        .then(() => {
                            localStorage.setItem('currentUser', JSON.stringify(this.user))
                            load.dismiss();
                        })
                })
                .catch((err) => {
                    load.dismiss()
                })
        });
    }

    generateFromImage(img, MAX_WIDTH, MAX_HEIGHT, quality, callback) {
        var canvas: any = document.createElement("canvas");
        var image = new Image();
        image.onload = () => {
            var width = image.width;
            var height = image.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width, height);
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL('image/jpeg', quality);
            callback(dataUrl)
        }
        image.src = img;
    }

    facebook() {
        if (this.user.facebook) {
            let url = 'www.facebook.com/' + this.user.facebook;
            window.open(url, '_blank')
        }
    }

    twitter() {
        if (this.user.facebook) {
            let url = 'www.twitter.com/' + this.user.twitter;
            window.open(url, '_blank')
        }
    }

    instagram() {
        if (this.user.facebook) {
            let url = 'www.instagram.com/' + this.user.instagram;
            window.open(url, '_blank')
        }
    }


    ionViewDidLoad() {
    }

}
