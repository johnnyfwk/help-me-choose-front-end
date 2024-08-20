import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Erro404() {
    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>404 • HelpMeChoose.uk</title>                
                <meta name="description" content="This page does not exist." />
            </Helmet>

            <main>
                <h1>404: Page does not exist</h1>

                <p>This page does not exist, yet you managed to find it...You are the chosen one!</p>

                <p>Check out some pages that do exist:</p>

                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/create-a-poll">Create a Poll</Link></li>
                    <li><Link to="/sign-up">Sign Up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </main>
        </>
    )
}