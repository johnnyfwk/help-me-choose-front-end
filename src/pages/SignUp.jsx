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

export default function SignUp({
    setIsEmailVerificationSuccessMessageVisible
}) {
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

    const [emailVerificationError, setEmailVerificationError] = useState(false);

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
        setEmailVerificationError("");
    }

    function handleUsername(event) {
        setUsername(event.target.value);
        setUsernameErrorMessage("");
        setEmailVerificationError("");
    }

    function handlePassword(event) {
        setPassword(event.target.value);
        setPasswordErrorMessage("");
        setEmailVerificationError("");
    }

    function handleProfileImageUrl(event) {
        setProfileImageUrl(event.target.value);
        setProfileImageUrlErrorMessage("");
        setEmailVerificationError("");
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
                    console.log("Username is not available");
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
                        setIsEmailVerificationSuccessMessageVisible(true);
                        setTimeout(() => {
                            setIsEmailVerificationSuccessMessageVisible(false);
                        }, 3000);
                        setEmailVerificationError("");
                    })
                    .catch((error) => {
                        setEmailVerificationError("Verification email could not be sent.");
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
                console.log('User account has been created.');
            })
            .catch((error) => {
                console.log(error);
            });

        let userId;
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://helpmechoose.uk/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Sign Up",
                "item": "https://helpmechoose.uk/sign-up"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/sign-up" />
                <title>Sign Up • HelpMeChoose.uk</title>                
                <meta name="description" content="Sign up at HelpMeChoose.uk to create a poll and get help making a choice." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Sign Up</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Sign Up</h1>

                    <p>Create an account to create a poll and get help making a choice from other members.</p>

                    <p>If you already have an account, <Link to="/login">login</Link> to your account.</p>

                    <div className="error">{emailVerificationError}</div>                

                    <form>
                        <div className="error">{emailErrorMessage}</div>

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
                        <li>Between 6 and 128 characters (inclusive).</li>
                    </ul>
                </section>
            </main>
        </>
    )
}