import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/about" />
                <title>About • HelpMeChoose.uk</title>                
                <meta name="description" content="HelpMeChoose.uk is a community where members can help each other make choices." />
            </Helmet>

            <main>
                <h1>About</h1>

                <p>Can't decide between pizza, curry, or tacos for dinner tonight? Not sure whether to get the latest Google Pixel or iPhone? Torn between visiting the Taj Mahal in India or the Colosseum in Italy for your next holiday?</p>

                <p>If you have a choice to make but can't decide between your options, <Link to="/create-a-poll">create a poll</Link> and get suggestions and advice from the community.</p>

                <p>Whether your poll is about which restaurant to go to tonight or which car you should buy, the community will help you make the right choice.</p>
            </main>
        </>
    )
}