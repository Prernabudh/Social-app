import firebase from "firebase";
import firebaseKeys from "./config";

class Fire {
  constructor() {
    firebase.initializeApp(firebaseKeys);
  }

  addPost = async ({ text, localUri }) => {
    const remoteUri = await this.uploadPhotoAsync(localUri);
    console.log(remoteUri);
    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text,
          uid: this.uid,
          timestamp: this.timestamp,
          image: remoteUri,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  uploadPhotoAsync = async (uri) => {
    const path = `photos/${this.uid}/${Date.now()}.jpg`;

    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  getData = () => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .get()
        .then((querySnapshot) => {
          console.log("Total users: ", querySnapshot.size);
          res(querySnapshot);
          querySnapshot.forEach((documentSnapshot) => {
            console.log(
              "User ID: ",
              documentSnapshot.id,
              documentSnapshot.data()
            );
          });
        })
        .catch((error) => {
          rej(error);
        });
    });
  };
  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
