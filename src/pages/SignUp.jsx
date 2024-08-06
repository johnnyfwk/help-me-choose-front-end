import { Helmet } from 'react-helmet';
import { useState } from 'react';
import * as utils from '../../utils';
import InputEmail from '../components/InputEmail';
import InputUsername from '../components/InputUsername';
import InputPassword from '../components/InputPassword';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [username, setUsername] = useState("");
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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
                    const member = userCredential.user;
                    console.log(member);
                    return setDoc(doc(db, 'users', member.uid), {
                        username: username,
                        email: member.email,
                        createdAt: new Date()
                    });
                })
                .then(() => {
                    console.log('User signed up and data saved in Firestore');
                })
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
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

                <form>
                    <InputEmail
                        email={email}
                        setEmail={setEmail}
                        emailErrorMessage={emailErrorMessage}
                        setEmailErrorMessage={setEmailErrorMessage}
                    />

                    <InputUsername
                        username={username}
                        setUsername={setUsername}
                        usernameErrorMessage={usernameErrorMessage}
                        setUsernameErrorMessage={setUsernameErrorMessage}
                    />

                    <InputPassword
                        password={password}
                        setPassword={setPassword}
                        passwordErrorMessage={passwordErrorMessage}
                        setPasswordErrorMessage={setPasswordErrorMessage}
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