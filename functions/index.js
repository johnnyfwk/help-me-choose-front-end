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

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Function to list all users
exports.listUsers = functions.https.onRequest(async (req, res) => {
    try {
        let users = [];
        // Use a recursive function to list all users
        const listAllUsers = async (nextPageToken) => {
            const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
            users = users.concat(listUsersResult.users);
            if (listUsersResult.pageToken) {
                // Continue listing users if there are more
                await listAllUsers(listUsersResult.pageToken);
            }
        };

        await listAllUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

