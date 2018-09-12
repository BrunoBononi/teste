import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Injectable()
export class FirebaseService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    // private firebaseAnalytics: FirebaseAnalytics
  ) {
  }

  /////////* AUTH */////////
  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  register(data) {
    return this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password);
  }
  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  /////////* CREATE TRACK */////////
  postTrack(data) {
    return this.afs.collection("tracks").add(data)
  }

  /////////* USERS */////////
  postUser(data) {
    return this.afs.collection("users").doc(data.uid).set(data);
  }
  saveUser(data) {
    return this.afs.collection("users").doc(data.uid).update(data);
  }
  getCurrentUser(uid) {

    const collection = this.afs.firestore.collection('users').doc(uid)
      .get()
      .then((res) => {
        return res.data();
      })

    return collection
  }

  /////////* FORGOT PASSWORD  */////////
  forgot(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  getAlbuns(uid) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('albuns')
        .where('owner', '==', uid)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();
            i.id = doc.id
            i.qnt = 0;
            items.push(i)
          })

          resolve(items)

        })
    })
  }

  getAlbunsForArtist(uid) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('playlists')
        .where('owner', '==', uid)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();
            i.id = doc.id

            this.afs.firestore.collection('albuns').doc(i.album)
              .get()
              .then((u) => {
                i.album = u.data()
                items.push(i.album)
              })
          })

          setTimeout(() => {
            resolve(items)
          }, 2000)

        })
    })
  }

  getRequests(uid) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('requests')
        .where('owner', '==', uid)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();
            i.id = doc.id
            i.qnt = 0;
            items.push(i)
          })

          resolve(items)

        })
    })
  }

  newAlbum(album, uid, image, ritmo) {
    return this.afs.collection('albuns').add({
      name: album,
      owner: uid,
      cover: image,
      categorie: ritmo
    })
  }

  getRelatedAlbuns(id) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('relatedAlbuns')
        .where('album', '==', id)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();

            this.afs.firestore.collection('tracks').doc(i.track).get()
              .then((r) => {
                let track = r.data();
                track.id = r.id;
                items.push(track)
                console.log(track)
              })

          })

          setTimeout(() => {
            resolve(items)
          }, 2000)

        })
    })
  }

  novoPedido(pedido) {
    return this.afs.collection('requests').add(pedido)
  }

  updateAlbum(id) {
    return this.afs.collection('albuns').doc(id).update({
      id: id
    })
  }

  newUser(data) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.senha)
        .then((res) => {
          let uid = res.uid;

          this.afs.collection('users').doc(uid)
            .set({
              email: data.email,
              name: data.nome,
              type: 'compositor',
              uid: uid,
              avatar: 'https://firebasestorage.googleapis.com/v0/b/sala3r1-900d1.appspot.com/o/default-avatar.png?alt=media&token=78562964-839f-4705-b6a9-79fb21c3e558'
            })
            .then(() => {
              resolve(uid)
            })
        })
    })
  }

  getTracks(uid) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('tracks')
        .where('owner', '==', uid)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();
            i.id = doc.id
            items.push(i)
          })

          resolve(items)

        })
    })
  }

  getTracksAlbum(id) {
    return new Promise((resolve, reject) => {
      this.afs.firestore.collection('tracks')
        .where('album', '==', id)
        .get()
        .then((res) => {
          let items = [];
          res.forEach((doc) => {
            let i = doc.data();
            i.id = doc.id
            items.push(i)
          })

          resolve(items)

        })
    })
  }

}
