import { Link } from "react-router-dom";

export default function Footer() {
    function handleFooterLinks() {
        window.scrollTo(0,0);
    }

    return (
        <footer>
            <div className="footer-heading-and-links-wrapper">
                <div>HelpMeChoose.uk</div>
                <div className="footer-links" onClick={handleFooterLinks}>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/sign-up">Sign Up</Link>
                </div>                
            </div>
            <div id="copyright">Copyright &copy; {new Date().getFullYear()} HelpMeChoose.uk. All Rights Reserved.</div>
        </footer>
    )
}