import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Contact() {
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
                "name": "Contact",
                "item": "https://helpmechoose.uk/contact"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/contact" />
                <title>Contact • HelpMeChoose.uk</title>                
                <meta name="description" content="Contact us at HelpMeChoose.uk." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Contact</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <div className="copy">
                        <h1>Contact</h1>

                        <p>HelpMeChoose.uk is a community where members can help each other make choices.</p>

                        <p>If you have any questions or suggestions about how we can improve the site, get in touch with us at hi@helpmechoose.uk.</p>
                    </div>
                </section>
            </main>
        </>
    )
}