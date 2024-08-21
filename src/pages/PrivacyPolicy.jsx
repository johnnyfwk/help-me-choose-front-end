import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
                "name": "Privacy Policy",
                "item": "https://helpmechoose.uk/privacy-policy"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/privacy-policy" />
                <title>Privacy Policy • HelpMeChoose.uk</title>                
                <meta name="description" content="Read the Privacy Policy for HelpMeChoose.uk." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Privacy Policy</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Terms of Service</h1>

                    <p><b>Last Updated</b>: 20 August 2024</p>

                    <p>HelpMeChoose.uk is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website/app.</p>

                    <h2>Information We Collect</h2>
                    <p>We may collect the following types of information:</p>
                    <ul>
                        <li><b>Personal Information</b>: Name, email address, and other contact details.</li>
                        <li><b>Usage Data</b>: IP address, browser type, pages visited, and other usage information.</li>
                        <li><b>Cookies</b>: We use cookies to enhance your experience on our website/app.</li>
                    </ul>

                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide and maintain our services.</li>
                        <li>Improve and personalise your experience.</li>
                        <li>Communicate with you about updates, promotions, and other news.</li>
                        <li>Analyse usage patterns and trends.</li>
                    </ul>

                    <h2>Sharing Your Information</h2>
                    <p>We may share your information with:</p>
                    <ul>
                        <li><b>Service Providers</b> Third-party vendors who assist us in providing our services.</li>
                        <li><b>Legal Requirements</b> If required by law or to protect our rights.</li>
                        <li><b>Business Transfers</b> In the event of a merger, sale, or other business transfer.</li>
                    </ul>

                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access, correct, or delete your personal information.</li>
                        <li>Opt-out of receiving promotional communications.</li>
                        <li>Disable cookies through your browser settings.</li>
                    </ul>

                    <h2>Data Security</h2>
                    <p>We take reasonable measures to protect your information from unauthorised access or disclosure. However, no security measures are completely secure.</p>

                    <h2>Children’s Privacy</h2>
                    <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

                    <h2>Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>

                    <h2>Contact Information</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at hi@helpmechoose.uk.</p>
                </section>
            </main>
        </>
    )
}