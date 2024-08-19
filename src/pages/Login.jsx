import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import InputEmail from '../components/InputEmail';
import InputPassword from '../components/InputPassword';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login({setIsLoginSuccessMessageVisible}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");    
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [loginError, setLoginError] = useState("");

    function handleEmail(event) {
        setEmail(event.target.value);
        setEmailErrorMessage("");
        setLoginError("");
    }

    function handlePassword(event) {
        setPassword(event.target.value);
        setPasswordErrorMessage("");
        setLoginError("");
    }

    function handleLogin() {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setIsLoginSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsLoginSuccessMessageVisible(false);
                }, 3000);
                setLoginError("");
            })
            .catch((error) => {
                setLoginError("Email or password is invalid.");
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

                <p>Login to your account to ask a question and get help making a choice from other members.</p>

                <p>If you don't have an account, <Link to="/sign-up">sign up</Link> for one.</p>

                <div className="error">{loginError}</div>

                <form>
                    <InputEmail
                        email={email}
                        handleEmail={handleEmail}
                    />

                    <InputPassword
                        id={"password"}
                        password={password}
                        handlePassword={handlePassword}
                        placeholder={"Password"}
                    />

                    <input
                        type="button"
                        value="Login"
                        onClick={handleLogin}
                        disabled={!email || !password}
                    />
                </form>

                <Link to="/reset-password">Reset Password</Link>
            </main>
        </>
    )
}