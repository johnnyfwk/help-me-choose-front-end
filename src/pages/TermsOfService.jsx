import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
                "name": "Terms of Service",
                "item": "https://helpmechoose.uk/terms-of-service"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/terms-of-service" />
                <title>Terms of Service • HelpMeChoose.uk</title>                
                <meta name="description" content="Read the Terms of Service for HelpMeChoose.uk." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <div aria-label="breadcrumb">
                    <div><Link to="/">Home</Link> &gt; Terms of Service</div>
                </div>
            </header>

            <main>
                <h1>Terms of Service</h1>

                <p><b>Last Updated</b>: 20 August 2024</p>

                <p>Welcome to HelpMeChoose.uk By accessing or using our website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>

                <h2>Acceptance of Terms</h2>
                <p>By using our website/app, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>

                <h2>Description of Services</h2>
                <p>HelpMeChoose.uk is a community where users can get help from other members to make choices by creating polls and sharing suggestions and opinions. We reserve the right to modify or discontinue our services at any time without notice.</p>

                <h2>User Obligations</h2>
                <p>Users must:</p>
                <ul>
                    <li>Be at least 13 years old.</li>
                    <li>Provide accurate and complete information when creating an account.</li>
                    <li>Be responsible for maintaining the confidentiality of their account information.</li>
                </ul>

                <h2>Prohibited Activities</h2>
                <p>Users are prohibited from:</p>
                <ul>
                    <li>Posting illegal, harmful, or offensive content.</li>
                    <li>Harassing, abusing, or threatening others.</li>
                    <li>Spamming or engaging in any form of unsolicited advertising.</li>
                    <li>Impersonating another person or entity.</li>
                </ul>

                <h2>Intellectual Property</h2>
                <p>All content on HelpMeChoose.uk, including text, graphics, logos, and software, is the property of HelpMeChoose.uk or its content suppliers and is protected by copyright laws. Users retain ownership of the content they post, such as comments and polls, but grant HelpMeChoose.uk a worldwide, non-exclusive, royalty-free license to use, display, and distribute such content on our platform.</p>

                <h2>User-Submitted Content and Images</h2>

                <p>When users add links to images for their profile or post other content, they must ensure that they have the right to use and display the images. By linking to or uploading an image, users represent and warrant that:</p>

                <ul>
                    <li>They own the image or have obtained the necessary rights or permissions to use it.</li>
                    <li>The image does not infringe on any third-party intellectual property rights, including copyright, trademark, or privacy rights.</li>
                    <li>The image complies with all applicable laws and our Community Guidelines.</li>
                </ul>

                <p>If you believe that a user has linked to or uploaded an image that infringes on your intellectual property rights, please notify us at hi@helpmechoose.uk.</p>

                <p>HelpMeChoose.uk reserves the right to remove any content, including images, that violates these terms or any applicable laws.</p>

                <h2>Limitation of Liability</h2>
                <p>HelpMeChoose.uk is provided "as is" and "as available." We do not guarantee that the service will be uninterrupted or error-free. We are not liable for any damages arising from the use of our website.</p>

                <h2>Modifications to Terms</h2>
                <p>We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page, and your continued use of the service constitutes acceptance of the updated terms.</p>

                <h2>Governing Law</h2>
                <p>These terms are governed by the laws of the UK, and any disputes will be resolved in the courts of the UK.</p>

                <h2>Contact Information</h2>
                <p>If you have any questions about these Terms of Service, please contact us at hi@helpmechoose.uk.</p>
            </main>
        </>
    )
}