import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import QuestionCard from '../components/QuestionCard';
import CommentCard from '../components/CommentCard';

export default function Profile() {
    const { user, loading } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!loading && user) {
            const fetchQuestions = () => {
                const questionsQuery = query(
                    collection(db, 'questions'),
                    where('questionOwnerId', '==', user.uid),
                    orderBy('created', 'desc')
                );
                
                getDocs(questionsQuery)
                    .then((questionsSnapshot) => {
                        const questionsData = questionsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setQuestions(questionsData);
                    })
                    .catch((error) => {
                        console.error("Error fetching questions: ", error);
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

                    <h2>Posts</h2>
                    {questions.length > 0
                        ? <div className="questions-wrapper">
                            {questions.map((question, index) => {
                                return <QuestionCard key={index} question={question} page="profile" />
                            })}
                        </div>
                        : <div>No questions to display.</div>
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
                            : <div>There are no comments for this question.</div>
                    }
                </section>
            </main>
        </>
    )
}