import { Link } from "react-router-dom";

export default function Footer({user}) {
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
                            ? <div>
                                <Link to="/create-a-poll" onClick={handleFooterLinks}>Create a Poll</Link>
                            </div>
                            : null
                        }
                        
                        {user
                            ? <div>
                                <Link to={`/profile/${user.uid}`} onClick={handleFooterLinks}>Profile</Link>
                            </div>
                            : <div>
                                <Link to="/sign-up" onClick={handleFooterLinks}>Sign Up</Link>
                                <Link to="/login" onClick={handleFooterLinks}>Login</Link>
                            </div>
                        }

                        <div>
                            <Link to="/about" onClick={handleFooterLinks}>About</Link>
                        </div>

                        <div>
                            <Link to="/contact" onClick={handleFooterLinks}>Contact</Link> 
                        </div>
                    </div>

                    <div className="footer-links-section-wrapper">
                        <div className="footer-links-section-heading">Legal Stuff</div>

                        <div>
                            <Link to="/community-guidelines" onClick={handleFooterLinks}>Community Guidelines</Link>
                        </div>

                        <div>
                            <Link to="/terms-of-service" onClick={handleFooterLinks}>Terms of Service</Link>
                        </div>

                        <div>
                            <Link to="/privacy-policy" onClick={handleFooterLinks}>Privacy Policy</Link>
                        </div>

                        <div>
                            <Link to="/cookie-policy" onClick={handleFooterLinks}>Cookie Policy</Link>
                        </div>

                        <div>
                            <Link to="/disclaimer" onClick={handleFooterLinks}>Disclaimer</Link>
                        </div>
                    </div>
                </div>

                <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
            </footer>
        </div>
    )
}