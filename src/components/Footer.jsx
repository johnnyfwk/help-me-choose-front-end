import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function Footer({user}) {
    const { logout } = useAuth();

    function handleFooterLinks() {
        window.scrollTo(0,0);
    }

    return (
        <footer>
            <div className="footer-heading-and-links-wrapper">
                <div>HelpMeChoose.uk</div>
                <div className="footer-links" onClick={handleFooterLinks}>
                    {user && user.emailVerified
                        ? <Link to="/post-a-question">Post a Question</Link>
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
            <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
        </footer>
    )
}