import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Footer({user}) {
    const { logout } = useAuth();

    function handleFooterLinks() {
        window.scrollTo(0,0);
    }

    return (
        <div id="footer-wrapper">
            <footer>
                <div className="footer-links-wrapper">
                    <div className="footer-links-section-wrapper">
                        <div className="footer-links-section-heading">HelpMeChoose.uk</div>
                        {user && user.emailVerified
                            ? <Link to="/create-a-poll" onClick={handleFooterLinks}>Create a Poll</Link>
                            : null
                        }
                        
                        {user
                            ? <>
                                <Link to={`/profile/${user.uid}`} onClick={handleFooterLinks}>Profile</Link>
                            </>
                            : <>
                                <Link to="/sign-up" onClick={handleFooterLinks}>Sign Up</Link>
                                <Link to="/login" onClick={handleFooterLinks}>Login</Link>
                            </>
                        }

                        <Link to="/about" onClick={handleFooterLinks}>About</Link>
                        <Link to="/contact" onClick={handleFooterLinks}>Contact</Link>     
                    </div>

                    <div className="footer-links-section-wrapper">
                        <div className="footer-links-section-heading">Legal Stuff</div>
                        <Link to="/community-guidelines" onClick={handleFooterLinks}>Community Guidelines</Link>
                        <Link to="/terms-of-service" onClick={handleFooterLinks}>Terms of Service</Link>
                        <Link to="/privacy-policy" onClick={handleFooterLinks}>Privacy Policy</Link>
                        <Link to="/cookie-policy" onClick={handleFooterLinks}>Cookie Policy</Link>
                        <Link to="/disclaimer" onClick={handleFooterLinks}>Disclaimer</Link>
                    </div>
                </div>

                <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
            </footer>
        </div>
    )
}