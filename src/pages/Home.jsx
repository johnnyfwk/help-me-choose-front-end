import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as utils from '../../utils';

export default function Home() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getDocs(collection(db, 'questions'))
            .then((response) => {               
                let questionsList = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                questionsList = questionsList.sort((a, b) => {
                    const latestA = a.modified ? a.modified.seconds : a.created.seconds;
                    const latestB = b.modified ? b.modified.seconds : b.created.seconds;
                    return latestB - latestA;
                });
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

                <div className="questions-wrapper">
                    {questions.map((question, index) => {
                        return (
                            <div key={index} className="question-wrapper">
                                <h2>{question.title}</h2>
                                <p>{question.description}</p>
                                <div>{question.category}</div>
                                <div>{question.username}</div>                                
                                <div>{utils.formatDate(question.created)}</div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </>
    )
}