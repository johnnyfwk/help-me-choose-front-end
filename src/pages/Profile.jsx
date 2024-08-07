import { Helmet } from 'react-helmet';
import { useAuth } from '../AuthContext';

export default function Profile({
    user
}) {
    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>Profile • HelpMeChoose.uk</title>                
                <meta name="description" content="User's profile on HelpMeChoose.uk." />
            </Helmet>

            <main>
                <h1>{user.displayName}</h1>

                <p>This is your profile page.</p>

                <h2>This is a sub-heading</h2>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tellus eu mattis gravida. Praesent et lacinia elit. Phasellus mauris orci, ultricies id ipsum quis, mollis aliquet diam. Curabitur sollicitudin, nisi vel rhoncus porta, ligula odio volutpat leo, vitae sodales dui justo non tortor. Pellentesque interdum diam ac sem condimentum efficitur. Cras dictum risus at porta vulputate. Nullam pulvinar, ante in congue vulputate, nisi dolor congue sapien, nec pellentesque ipsum dui nec tellus. Vivamus non purus est. Curabitur vitae gravida neque. Sed in massa at sem luctus mattis a eget ipsum. Nam lectus risus, placerat euismod elit eget, blandit faucibus metus. Aenean tristique dictum est, cursus ultrices sem blandit at. Mauris at eros auctor, congue lorem nec, convallis massa. Quisque feugiat eros vel quam convallis, eget malesuada risus cursus.</p>
            </main>
        </>
    )
}