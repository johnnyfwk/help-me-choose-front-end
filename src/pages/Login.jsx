import { useState } from 'react';
import { Helmet } from 'react-helmet';
import InputEmailOrUsername from '../components/InputEmailOrUsername';
import InputPassword from '../components/InputPassword';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailOrUsernameErrorMessage, setEmailOrUsernameErrorMessage] = useState("");
    const [error, setError] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    function handleLogin() {
        signInWithEmailAndPassword(auth, emailOrUsername, password)
            .then((response) => {
                console.log(response);
                console.log("Logged in successfully!");
            })
            .catch((error) => {
                console.log(error);
                setError("Email or password is invalid.");
            })
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/login" />
                <title>Login • HelpMeChoose.uk</title>                
                <meta name="description" content="Login to HelpMeChoose.uk." />
            </Helmet>

            <main>
                <h1>Login</h1>

                <p>Login to your account to ask a question and get responses from other members.</p>

                <form>
                    <InputEmailOrUsername
                        emailOrUsername={emailOrUsername}
                        setEmailOrUsername={setEmailOrUsername}
                        password={password}
                        setPassword={setPassword}
                        emailOrUsernameErrorMessage={emailOrUsernameErrorMessage}
                        setEmailOrUsernameErrorMessage={setEmailOrUsernameErrorMessage}
                        setError={setError}
                    />

                    <InputPassword
                        password={password}
                        setPassword={setPassword}
                        passwordErrorMessage={passwordErrorMessage}
                        setPasswordErrorMessage={setPasswordErrorMessage}
                        setError={setError}
                    />

                    <div className="error">{error}</div>

                    <input
                        type="button"
                        value="Login"
                        onClick={handleLogin}
                        disabled={!emailOrUsername || !password}
                    />
                </form>
            </main>
        </>
    )
}