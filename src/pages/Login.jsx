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
                "name": "Login",
                "item": "https://helpmechoose.uk/login"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/login" />
                <title>Login • HelpMeChoose.uk</title>                
                <meta name="description" content="Login to your HelpMeChoose.uk account." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Login</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Login</h1>

                    <p>Login to your account to ask a question and get help making a choice from other members.</p>

                    <p>If you don't have an account, <Link to="/sign-up">sign up</Link> for one.</p>

                    <p>If you have forgotton your password, reset it <Link to="/reset-password">here</Link>.</p>

                    {loginError
                        ? <div className="error">{loginError}</div>
                        : null
                    }

                    <form id="login">
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

                        <div>
                            <button
                                onClick={handleLogin}
                                disabled={!email || !password}
                            >Login</button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    )
}