import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CriarcontaPage } from '../pages/criarconta/criarconta';
import { EntrarPage } from '../pages/entrar/entrar';
import { ProfilePage } from '../pages/profile/profile';
import { AlbumsPage } from '../pages/albums/albums';
import { TracksPage } from '../pages/tracks/tracks';
import { UploadPage } from '../pages/upload/upload';

import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { MediaCapture } from '@ionic-native/media-capture';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
export const firebaseconfig = {
  apiKey: "AIzaSyB6DvNq2V88k5EOnu-f7mJaPt1LJIV3oYo",
  authDomain: "sala3r1-900d1.firebaseapp.com",
  databaseURL: "https://sala3r1-900d1.firebaseio.com",
  projectId: "sala3r1-900d1",
  storageBucket: "sala3r1-900d1.appspot.com",
  messagingSenderId: "911912406004",
  timestampsInSnapshots: true,
};
import { FirebaseService } from '../providers/firebase';
import { ImagesUpload } from '../providers/images-upload';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ModalPageModule } from '../pages/modal/modal.module';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { PerfilPage } from '../pages/perfil/perfil';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CriarcontaPage,
    EntrarPage,
    AlbumsPage,
    TracksPage,
    UploadPage,
    HomePage,
    PerfilPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ProfilePageModule,
    ModalPageModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    HomePage,
    MyApp,
    LoginPage,
    CriarcontaPage,
    EntrarPage,
    AlbumsPage,
    TracksPage,
    UploadPage,
    PerfilPage
  ],
  providers: [
    Camera,
    MediaCapture,
    File,
    Media,
    FirebaseService,
    StatusBar,
    SplashScreen,
    ImagesUpload,
    FileChooser,
    FilePath,
    IOSFilePicker
    // { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
