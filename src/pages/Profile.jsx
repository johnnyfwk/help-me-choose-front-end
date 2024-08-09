import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import QuestionCard from '../components/QuestionCard';
import CommentCard from '../components/CommentCard';
import * as utils from '../../utils';

export default function Profile() {
    const { user, loading } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [getQuestionsError, setGetQuestionsError] = useState("");

    useEffect(() => {
        if (!loading && user) {
            const fetchQuestions = () => {
                const questionsQuery = query(
                    collection(db, 'questions'),
                    where('questionOwnerId', '==', user.uid),
                    orderBy('questionCreated', 'desc')
                );
                
                getDocs(questionsQuery)
                    .then((questionsSnapshot) => {
                        const questionsData = questionsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        const questionsOrdered = utils.sortQuestions(questionsData);
                        setQuestions(questionsOrdered);
                        setGetQuestionsError("");
                    })
                    .catch((error) => {
                        console.error("Error fetching questions: ", error);
                        setGetQuestionsError("Questions could not be retrieved.");
                    });
            };

            const fetchComments = () => {
                const commentsQuery = query(
                    collection(db, 'comments'),
                    where('commentOwnerId', '==', user.uid),
                    orderBy('commentCreated', 'desc')
                );

                getDocs(commentsQuery)
                    .then((commentsSnapshot) => {
                        const commentsData = commentsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setComments(commentsData);
                    })
                    .catch((error) => {
                        console.error("Error fetching comments: ", error);
                    });
            };

            fetchQuestions();
            fetchComments();
        }        
    }, [])

    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://helpmechoose.uk/" />
                <title>Profile • HelpMeChoose.uk</title>                
                <meta name="description" content="User's profile on HelpMeChoose.uk." />
            </Helmet>

            <main>
                <section>
                    <h1>{user.displayName}</h1>
                    <p>This is your profile page.</p>

                    <h2>Questions</h2>
                    <div className="error">{getQuestionsError}</div>
                    {questions.length > 0
                        ? <div className="questions-wrapper">
                            {questions.map((question, index) => {
                                return <QuestionCard key={index} question={question} page="profile" />
                            })}
                        </div>
                        : <div>You haven't posted any questions.</div>
                    }
                </section>
                
                <section>
                    <h2>Comments</h2>
                    {comments.length > 0
                        ? <div className="comments-wrapper">
                            {comments.map((comment, index) => {
                                return <CommentCard key={index} comment={comment} page="profile"/>
                            })}
                        </div>
                        : <div>You haven't posted any comments on any questions.</div>
                    }
                </section>
            </main>
        </>
    )
}