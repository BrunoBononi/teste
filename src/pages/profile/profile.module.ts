import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { IonicAudioModule, defaultAudioProviderFactory } from 'ionic-audio';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(ProfilePage),
    IonicAudioModule.forRoot(defaultAudioProviderFactory), 
  ],
})
export class ProfilePageModule {}
  