import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification  } from 'firebase/auth';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import * as utils from '../../utils';
import InputEmail from '../components/InputEmail';
import InputUsername from '../components/InputUsername';
import InputPassword from '../components/InputPassword';
import InputProfileImage from '../components/InputProfileImage';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [username, setUsername] = useState("");
    const [registeredUsernames, setRegisteredUsernames] = useState([]);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const defaultImageUrl = '/images/default-profile-image.png';
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [profileImageUrlErrorMessage, setProfileImageUrlErrorMessage] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        getDocs(collection(db, 'users'))
            .then((response) => {              
                const usernamesList = utils.extractDocData(response);
                setRegisteredUsernames(usernamesList);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    function handleEmail(event) {
        setEmail(event.target.value);
        setEmailErrorMessage("");
        setError("");
    }

    function handleUsername(event) {
        setUsername(event.target.value);
        setUsernameErrorMessage("");
        setError("");
    }

    function handlePassword(event) {
        setPassword(event.target.value);
        setPasswordErrorMessage("");
        setError("");
    }

    function handleProfileImageUrl(event) {
        setProfileImageUrl(event.target.value);
        setProfileImageUrlErrorMessage("");
        setError("");
    }

    function handleCreateAccount() {
        const emailCheck = utils.validateEmail(email);
        if (!emailCheck.isValid) {
            setEmailErrorMessage(emailCheck.msg);
            return;
        }

        const usernameCheck = utils.validateUsername(username, registeredUsernames);
        if (!usernameCheck.isValid) {
            setUsernameErrorMessage(usernameCheck.msg);
            return;
        }

        const passwordCheck = utils.validatePassword(password);
        if (!passwordCheck.isValid) {
            setPasswordErrorMessage(passwordCheck.msg);
            return;
        }

        const profileImageUrlTrimmed = profileImageUrl.trim();

        const validateProfileImage = profileImageUrlTrimmed
            ? utils.validateImageUrl(profileImageUrlTrimmed)
            : Promise.resolve(true);

        validateProfileImage
            .then((response) => {
                if (response) {
                    return getDocs(collection(db, 'users'))
                } else {
                    setProfileImageUrlErrorMessage("Profile image URL is not valid.");
                    return;
                }                
            })
            .then((response) => {
                const usernamesList = utils.extractDocData(response);
                const lowercaseUsernames = usernamesList.map((username) => username.displayName.toLowerCase());
                if (lowercaseUsernames.includes(username.toLowerCase())) {
                    console.log("Username is NOT available");
                    return;
                } else {
                    return createUserWithEmailAndPassword(auth, email, password);
                }
            })
            .then((userCredential) => {
                userId = userCredential.user.uid;
                const user = userCredential.user;

                sendEmailVerification(user)
                    .then((response) => {
                        console.log(response);
                        console.log("Verification email sent.");
                    })
                    .catch((error) => {
                        console.log(error);
                        console.error("Error sending verification email:", error);
                    })
                return updateProfile(user, {
                    displayName: username,
                    photoURL: profileImageUrlTrimmed || defaultImageUrl
                });
            })
            .then(() => {
                return addDoc(collection(db, 'users'), {
                    userId,
                    displayName: username,
                    photoURL: profileImageUrlTrimmed || defaultImageUrl
                });
            })
            .then(() => {
                console.log('User account has been created and display name added to Firestore.');
            })
            .catch((error) => {
                console.log(error);
            });

        let userId;
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/sign-up" />
                <title>Sign Up • HelpMeChoose.uk</title>                
                <meta name="description" content="Sign up to post questions at HelpMeChoose.uk." />
            </Helmet>

            <main>
                <h1>Sign Up</h1>

                <p>Create an account to post questions and get help making a choice from other members.</p>

                <p>If you already have an account, <Link to="/login">login</Link> to your account.</p>

                <div className="error">{error}</div>
                <div className="error">{emailErrorMessage}</div>
                
                <form>
                    <InputEmail
                        email={email}
                        handleEmail={handleEmail}
                    />

                    <div className="error">{usernameErrorMessage}</div>                  

                    <InputUsername
                        username={username}
                        handleUsername={handleUsername}
                    />

                    <div className="error">{passwordErrorMessage}</div>

                    <InputPassword
                        id={"password"}
                        password={password}
                        handlePassword={handlePassword}
                        placeholder={"Password"}
                    />

                    <div className="error">{profileImageUrlErrorMessage}</div>

                    <InputProfileImage
                        profileImageUrl={profileImageUrl}
                        handleProfileImageUrl={handleProfileImageUrl}
                    />

                    <input
                        type="button"
                        value="Create Account"
                        onClick={handleCreateAccount}
                        disabled={!username || !password || !email}
                    />
                </form>

                <h2>Username and Password Criteria</h2>

                <h3>Username:</h3>
                <ul>
                    <li>Between 3 and 20 characters (inclusive).</li>
                    <li>Can only contain letters (uppercase and lowercase) and numbers.</li>
                </ul>

                <h3>Password:</h3>
                <ul>
                    <li>Between 8 and 128 characters (inclusive).</li>
                </ul>
            </main>
        </>
    )
}