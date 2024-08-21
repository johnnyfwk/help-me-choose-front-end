import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import InputEmail from '../components/InputEmail';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [passwordResetMessage, setPasswordResetMessage] = useState("");

    const navigate = useNavigate();

    function handleEmail(event) {
        setEmail(event.target.value);
    }

    function handleResetPassword() {
        sendPasswordResetEmail(auth, email)
            .then((response) => {
                setPasswordResetMessage("Password reset email sent.");
                setEmail("");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                
            })
            .catch((error) => {
                if (error.code === "auth/invalid-email") {
                    setPasswordResetMessage("Please enter a valid email address.");
                } else {
                    setPasswordResetMessage("Password reset email could not be sent.");
                }
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
                "name": "Reset Password",
                "item": "https://helpmechoose.uk/reset-password"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/reset-password" />
                <title>Reset Password • HelpMeChoose.uk</title>                
                <meta name="description" content="Reset the password for your HelpMeChoose.uk account." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb">
                        <div><Link to="/">Home</Link> &gt; Reset Password</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Reset Password</h1>

                    <p>If you have forgotton your password, reset it by entering your email address.</p>

                    <p>An email with a link will be sent to the address provided where you can create a new password.</p>

                    <div>{passwordResetMessage}</div>

                    <form>
                        <InputEmail
                            email={email}
                            handleEmail={handleEmail}
                        />
                        
                        <input
                            type="button"
                            value="Reset Password"
                            onClick={handleResetPassword}
                            disabled={!email}
                        />
                    </form>
                </section>
            </main>
        </>
    )
}