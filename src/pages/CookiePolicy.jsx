import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function CookiePolicy() {
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
                "name": "Cookie Policy",
                "item": "https://helpmechoose.uk/cookie-policy"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/cookie-policy" />
                <title>Cookie Policy • HelpMeChoose.uk</title>                
                <meta name="description" content="Read the Cookie Policy for HelpMeChoose.uk." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Cookie Policy</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Cookie Policy</h1>

                    <p><b>Last Updated</b>: 20 August 2024</p>

                    <p>HelpMeChoose.uk uses cookies to improve your experience on our website. This Cookie Policy explains what cookies are, how we use them, and how you can manage them.</p>

                    <h2>What Are Cookies?</h2>
                    <p>Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>

                    <h2>Types of Cookies We Use</h2>
                    <ul>
                        <li><b>Essential Cookies</b> These cookies are necessary for the operation of our website.</li>
                        <li><b>Analytical Cookies</b> These cookies help us understand how users interact with our website.</li>
                        <li><b>Advertising Cookies</b> These cookies are used to deliver relevant advertisements to you.</li>
                    </ul>

                    <h2>How We Use Cookies</h2>
                    <p>We use cookies to:</p>
                    <ul>
                        <li>Remember your preferences and settings.</li>
                        <li>Analyse website traffic and usage patterns.</li>
                        <li>Deliver personalised content and advertisements.</li>
                    </ul>

                    <h2>Managing Cookies</h2>
                    <p>You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.</p>

                    <h2>Changes to This Cookie Policy</h2>
                    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.</p>

                    <h2>Contact Information</h2>
                    <p>If you have any questions about this Cookie Policy, please contact us at HelpMeChoose.uk.</p>
                </section>
            </main>
        </>
    )
}