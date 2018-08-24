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



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CriarcontaPage,
    EntrarPage,
    ProfilePage,
    AlbumsPage,
    TracksPage,
    UploadPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    CriarcontaPage,
    EntrarPage,
    ProfilePage,
    AlbumsPage,
    TracksPage,
    UploadPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
