import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Footer({user}) {
    const { logout } = useAuth();

    function handleFooterLinks() {
        window.scrollTo(0,0);
    }

    return (
        <footer>
            <div className="links-wrapper">
                <div className="links-section-wrapper">
                    <div className="links-section-heading">HelpMeChoose.uk</div>
                    <div className="footer-links" onClick={handleFooterLinks}>
                        {user && user.emailVerified
                            ? <Link to="/create-a-poll">Create a Poll</Link>
                            : null
                        }
                        
                        {user
                            ? <>
                                <Link to={`/profile/${user.uid}`}>Profile</Link>
                                <span onClick={logout} id="logout-button">Logout</span>
                            </>
                            : <>
                                <Link to="/sign-up">Sign Up</Link>
                                <Link to="/login">Login</Link>
                            </>
                        }
                    </div>          
                </div>

                <div className="links-section-wrapper">
                    <div className="links-section-heading">Legal Stuff</div>
                    <Link to="/community-guidelines" onClick={handleFooterLinks}>Community Guidelines</Link>
                    <Link to="/terms-of-service" onClick={handleFooterLinks}>Terms of Service</Link>
                    <Link to="/privacy-policy" onClick={handleFooterLinks}>Privacy Policy</Link>
                    <Link to="/cookie-policy" onClick={handleFooterLinks}>Cookie Policy</Link>
                    <Link to="/disclaimer" onClick={handleFooterLinks}>Disclaimer</Link>
                </div>

                <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
            </div>
        </footer>
    )
}