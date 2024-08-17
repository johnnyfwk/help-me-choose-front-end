import { Link } from "react-router-dom";

export default function Logo({setCategory}) {
    function handleLogo() {
        setCategory("");
    }

    return (
        <Link to="/" id="logo" onClick={handleLogo}>Help Me Choose</Link>
    )
}