import { Helmet } from "react-helmet";

export default function Contact() {
    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/contact" />
                <title>Contact • HelpMeChoose.uk</title>                
                <meta name="description" content="Contact us at HelpMeChoose.uk." />
            </Helmet>

            <main>
                <h1>Contact</h1>

                <p>HelpMeChoose.uk is a community where members can help each other make choices.</p>

                <p>If you have any questions or suggestions about how we can improve the site, get in touch with us at hi@helpmechoose.uk.</p>
            </main>
        </>
    )
}