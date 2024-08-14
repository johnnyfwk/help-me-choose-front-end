import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [profileImageUrlErrorMessage, setProfileImageUrlErrorMessage] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        getDocs(collection(db, 'displayNames'))
            .then((response) => {              
                const usernamesList = utils.extractDocData(response);
                setRegisteredUsernames(usernamesList);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    function handleProfileImageUrl(event) {
        setProfileImageUrl(event.target.value);
        setProfileImageUrlErrorMessage("");
        setError("");
    }

    function handleUsername(event) {
        setUsername(event.target.value);
        setUsernameErrorMessage("");
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

        const validateProfileImage = profileImageUrl
            ? utils.validateProfileImageUrl(profileImageUrl)
            : Promise.resolve(true);

        validateProfileImage
            .then((response) => {
                if (response) {
                    return getDocs(collection(db, 'displayNames'))
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
                    setIsUsernameAvailable(false);
                    return;
                } else {
                    return createUserWithEmailAndPassword(auth, email, password);
                }
            })
            .then((userCredential) => {
                userId = userCredential.user.uid;
                const member = userCredential.user;
                return updateProfile(member, {
                    displayName: username,
                    photoURL: profileImageUrl
                });
            })
            .then(() => {
                return addDoc(collection(db, 'displayNames'), {
                    displayName: username,
                    userId
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
                <p>Create an account to post questions and get answers from other users.</p>

                <div className="error">{error}</div>
                <div className="error">{emailErrorMessage}</div>
                
                <form>
                    <InputEmail
                        email={email}
                        setEmail={setEmail}
                        setEmailErrorMessage={setEmailErrorMessage}
                        setError={setError}
                    />

                    <div className="error">{usernameErrorMessage}</div>                  

                    <InputUsername
                        username={username}
                        handleUsername={handleUsername}
                    />

                    <div className="error">{passwordErrorMessage}</div>

                    <InputPassword
                        password={password}
                        setPassword={setPassword}
                        setPasswordErrorMessage={setPasswordErrorMessage}
                        error={error}
                        setError={setError}
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