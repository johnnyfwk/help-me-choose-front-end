import { Helmet } from 'react-helmet';
import { useState } from 'react';
import * as utils from '../../utils';
import InputEmail from '../components/InputEmail';
import InputUsername from '../components/InputUsername';
import InputPassword from '../components/InputPassword';

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
            console.log("Account has been created successfully!");
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

                <h2>Username and Password Requirements</h2>

                <h3>Username:</h3>
                <ul>
                    <li>Between 3 and 20 characters (inclusive) long.</li>
                    <li>Can only contain letters (uppercase and lowercase) and numbers.</li>
                </ul>

                <h3>Password:</h3>
                <ul>
                    <li>Between 8 and 128 characters (inclusive) long.</li>
                </ul>                

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tellus eu mattis gravida. Praesent et lacinia elit. Phasellus mauris orci, ultricies id ipsum quis, mollis aliquet diam. Curabitur sollicitudin, nisi vel rhoncus porta, ligula odio volutpat leo, vitae sodales dui justo non tortor. Pellentesque interdum diam ac sem condimentum efficitur. Cras dictum risus at porta vulputate. Nullam pulvinar, ante in congue vulputate, nisi dolor congue sapien, nec pellentesque ipsum dui nec tellus. Vivamus non purus est. Curabitur vitae gravida neque. Sed in massa at sem luctus mattis a eget ipsum. Nam lectus risus, placerat euismod elit eget, blandit faucibus metus. Aenean tristique dictum est, cursus ultrices sem blandit at. Mauris at eros auctor, congue lorem nec, convallis massa. Quisque feugiat eros vel quam convallis, eget malesuada risus cursus.</p>

                <p>Etiam nibh nunc, volutpat quis varius non, placerat in est. Integer tortor elit, condimentum elementum dapibus et, dictum ut libero. Phasellus sit amet vestibulum lacus. Proin vitae sagittis justo, ac dignissim diam. Integer eu orci eget lacus consectetur vehicula quis vel neque. Nullam non euismod velit. Etiam id interdum ante. Mauris ac turpis vitae purus sollicitudin auctor. Sed ut libero sed erat placerat tincidunt a et dui. Quisque convallis, justo a congue maximus, ipsum quam rhoncus ante, molestie pharetra magna nulla at nunc. In interdum nec ipsum in porta. Donec tortor leo, elementum vitae ante commodo, maximus tincidunt est. Quisque pellentesque, mauris vitae hendrerit viverra, ipsum orci interdum felis, a fringilla felis ipsum quis dolor. Etiam nec facilisis dolor, ac semper ipsum.</p>

                <p>Curabitur condimentum vulputate dui, ac commodo dui malesuada non. Sed nec mattis est. Aenean malesuada feugiat dui, vel imperdiet ligula vestibulum id. Nulla quam mauris, sollicitudin ut nisl ac, lacinia sollicitudin justo. In aliquam tortor nunc, ac viverra sem volutpat vel. Ut pulvinar aliquet diam aliquet molestie. Cras quis gravida purus, eget tincidunt sapien.</p>

                <p>Quisque in magna in velit mattis porta. Vestibulum iaculis tincidunt blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam enim felis, sagittis condimentum mi ut, vestibulum rhoncus magna. Maecenas dictum condimentum cursus. Fusce nec blandit neque. Sed nec est massa. Ut placerat nibh eget convallis bibendum. Duis et sem molestie, ultricies nunc quis, lobortis ex. Curabitur nibh enim, pharetra in enim at, lobortis pretium lacus. Etiam ut interdum purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur mi orci, ullamcorper vel lacinia vel, dignissim ac nibh. Aliquam tincidunt felis sit amet magna fringilla varius. Aliquam commodo odio sit amet scelerisque feugiat.</p>

                <p>Vestibulum vel eros vel mauris laoreet ornare. Mauris diam mi, tempor eu pharetra eu, rutrum eu arcu. Ut condimentum sed arcu et lacinia. Nulla facilisi. Praesent viverra congue enim, eu varius dolor. Fusce sapien ligula, bibendum sed interdum et, lacinia vel est. Donec porttitor blandit ex, ac gravida erat. Sed fermentum vel justo at convallis. Cras ut odio auctor, pharetra neque sit amet, condimentum mi.</p>
            </main>
        </>
    )
}