import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import * as utils from '../../utils';
import InputEmail from '../components/InputEmail';
import InputUsername from '../components/InputUsername';
import InputPassword from '../components/InputPassword';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [username, setUsername] = useState("");
    const [registeredUsernames, setRegisteredUsernames] = useState([]);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        getDocs(collection(db, 'displayNames'))
            .then((response) => {              
                const usernamesList = utils.extractDocData(response);
                console.log(usernamesList);
                setRegisteredUsernames(usernamesList);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    function handleCreateAccount() {
        const emailCheck = utils.validateEmail(email);
        setEmailErrorMessage(emailCheck.msg);
        const usernameCheck = utils.validateUsername(username);
        setUsernameErrorMessage(usernameCheck.msg);
        const passwordCheck = utils.validatePassword(password);
        setPasswordErrorMessage(passwordCheck.msg);

        if (usernameCheck.isValid && passwordCheck.isValid && emailCheck.isValid) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log(username)
                    const member = userCredential.user;
                    return updateProfile(member, {
                        displayName: username
                    });
                })
                .then(() => {
                    return addDoc(collection(db, 'displayNames'), {
                        displayName: username
                    });
                })
                .then((response) => {
                    console.log(response);
                    console.log('User account has been created and display name added to Firestore.');
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                    setError("There was an error creating the account.");
                });
        } else {
            console.log("Account could not be created.");
        }
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

                <div className="error">{emailErrorMessage}</div>
                <div className="error">{usernameErrorMessage}</div>
                <div className="error">{passwordErrorMessage}</div>

                <form>
                    <InputEmail
                        email={email}
                        setEmail={setEmail}
                        setEmailErrorMessage={setEmailErrorMessage}
                        setError={setError}
                    />

                    <InputUsername
                        username={username}
                        setUsername={setUsername}
                        setUsernameErrorMessage={setUsernameErrorMessage}
                        setError={setError}
                        registeredUsernames={registeredUsernames}
                        isUsernameAvailable={isUsernameAvailable}
                        setIsUsernameAvailable={setIsUsernameAvailable}
                    />

                    <InputPassword
                        password={password}
                        setPassword={setPassword}
                        setPasswordErrorMessage={setPasswordErrorMessage}
                        error={error}
                        setError={setError}
                    />

                    <div className="error">{error}</div>

                    <input
                        type="button"
                        value="Create Account"
                        onClick={handleCreateAccount}
                        disabled={!username || !password || !email || !isUsernameAvailable}
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