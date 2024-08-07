import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import QuestionCard from "../components/QuestionCard";
import * as utils from '../../utils';

export default function Home() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getDocs(collection(db, 'questions'))
            .then((response) => {               
                const questionsList = utils.sortDocs(response);
                setQuestions(questionsList);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>Let others help you make a choice • HelpMeChoose.uk</title>                
                <meta name="description" content="Post a question and let others help you make a choice." />
            </Helmet>

            <main>
                <h1>Let others help you make a choice</h1>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tellus eu mattis gravida. Praesent et lacinia elit. Phasellus mauris orci, ultricies id ipsum quis, mollis aliquet diam. Curabitur sollicitudin, nisi vel rhoncus porta, ligula odio volutpat leo, vitae sodales dui justo non tortor.</p>

                {questions.length > 0
                    ? <div className="questions-wrapper">
                        {questions.map((question, index) => {
                            return <QuestionCard key={index} question={question} />
                        })}
                    </div>
                    : <div>No questions to display.</div>
                }
            </main>
        </>
    )
}