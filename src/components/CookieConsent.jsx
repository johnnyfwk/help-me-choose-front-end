import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isCookieConsentBannerVisible, setIsCookieConsentBannerVisible] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setIsCookieConsentBannerVisible(true);
        }
    }, []);

    function handleAcceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsCookieConsentBannerVisible(false);
    };

    function handleLearnMore() {
        window.scrollTo(0, 0);
    }

    if (!isCookieConsentBannerVisible) {
        return null;
    }

    return (
        <div id="cookie-consent-banner">
            <p>This website uses cookies to ensure you get the best experience. <Link id="cookie-consent-message" to="/cookie-policy" onClick={handleLearnMore}>Learn more</Link></p>

            <button
                id="accept-cookies"
                onClick={handleAcceptCookies}
            >Accept</button>
        </div>
    )
}