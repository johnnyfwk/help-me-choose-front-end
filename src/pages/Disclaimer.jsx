import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Disclaimer() {
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
                "name": "Disclaimer",
                "item": "https://helpmechoose.uk/disclaimer"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/disclaimer" />
                <title>Disclaimer • HelpMeChoose.uk</title>                
                <meta name="description" content="Read the Disclaimer for HelpMeChoose.uk." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Disclaimer</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Disclaimer</h1>

                    <p><b>Last Updated</b>: 20 August 2024</p>

                    <p>The information provided on HelpMeChoose.uk is for general informational and entertainment purposes only. While we strive to ensure that the content is accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the information on our platform.</p>

                    <h2>No Responsibility for User Content</h2>
                    <p>HelpMeChoose.uk allows users to post content such as polls and comments. We do not endorse, guarantee, or take responsibility for the accuracy or reliability of user-generated content.</p>

                    <h2>No Professional Advice</h2>
                    <p>The content on our platform is not intended to be a substitute for professional advice, including but not limited to legal, financial, or medical advice. Always seek the advice of a qualified professional with any questions you may have.</p>

                    <h2>Limitation of Liability</h2>
                    <p>In no event shall HelpMeChoose.uk be liable for any loss or damage arising out of or in connection with the use of our platform, whether direct, indirect, incidental, or consequential.</p>

                    <h2>Changes to This Disclaimer</h2>
                    <p>We may update this Disclaimer from time to time. Any changes will be posted on this page with an updated date.</p>

                    <h2>Contact Information</h2>
                    <p>If you have any questions about this Disclaimer, please contact us at hi@helpmechoose.uk.</p>
                </section>
            </main>
        </>
    )
}