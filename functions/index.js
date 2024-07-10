/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.uploadImage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const image = req.body.image;
      const buffer = Buffer.from(image, "base64");
      const fileName = `profilePictures/${req.body.uid}`;
      const file = admin.storage().bucket().file(fileName);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
      });

      const downloadURL = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      res.status(200).send({ downloadURL });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});
