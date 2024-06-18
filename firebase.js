// firebase.js
const firebase = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Khởi tạo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC92E82vR2ISbFoKVeiYrgGZn7bNaF1Qrs",
  authDomain: "e-commercial-4c6c1.firebaseapp.com",
  projectId: "e-commercial-4c6c1",
  storageBucket: "e-commercial-4c6c1.appspot.com",
  messagingSenderId: "815972132250",
  appId: "1:815972132250:web:4f706d9be5c0136a324623"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Hàm tải ảnh lên Firebase Storage
const uploadImageToFirebase = async (imageName, imageBuffer) => {
  const imageRef = ref(storage, `${imageName}_${Date.now()}`);
  const metadata = {
    contentType: 'image/jpeg' // Bạn có thể thay đổi loại content tùy theo loại ảnh
  };

  try {
    const snapshot = await uploadBytes(imageRef, imageBuffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = {
  uploadImageToFirebase
};
