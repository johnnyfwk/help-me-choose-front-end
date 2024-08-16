import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from "firebase/auth";
import QuestionCard from '../components/QuestionCard';
import CommentCard from '../components/CommentCard';
import * as utils from '../../utils';

export default function Profile() {
    const { user, loading } = useAuth();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [getQuestionsError, setGetQuestionsError] = useState("");

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isConfirmDeleteProfileVisible, setIsConfirmDeleteProfileVisible] = useState(false);

    const navigate = useNavigate();

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

    function updateComment(updatedComment) {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        );
    }

    function handleEditProfile() {
        setIsEditingProfile(true);
    }

    function handleCancelEditProfile() {
        setIsEditingProfile(false);
    }

    function handleUpdateProfile() {
        setIsEditingProfile(false);
    }

    function handleDeleteProfile() {
        setIsEditingProfile(false);
        setIsConfirmDeleteProfileVisible(true);
    }

    function handleDeleteProfileNo() {
        setIsConfirmDeleteProfileVisible(false);
    }

    function handleDeleteProfileYes() {
        const displayNamesQuery = query(
            collection(db, 'displayNames'),
            where('userId', '==', user.uid)
        );

        const questionsQuery = query(
            collection(db, 'questions'),
            where('questionOwnerId', '==', user.uid)
        );

        const commentsQuery = query(
            collection(db, 'comments'),
            where('commentOwnerId', '==', user.uid)
        );

        getDocs(commentsQuery)
            .then((commentsSnapshot) => {
                const deleteCommentPromises = commentsSnapshot.docs.map((commentDoc) => {
                    return deleteDoc(commentDoc.ref);
                });
                return Promise.all(deleteCommentPromises);
            })
            .then((response) => {
                return getDocs(questionsQuery);
            })
            .then((questionsSnapshot) => {
                const deleteQuestiondsPromises = questionsSnapshot.docs.map((questionDoc) => {
                    return deleteDoc(questionDoc.ref);
                });
                return Promise.all(deleteQuestiondsPromises);
            })
            .then((response) => {
                return getDocs(displayNamesQuery);
            })
            .then((displayNamesSnapshot) => {
                const deleteDisplayNamesPromises = displayNamesSnapshot.docs.map((displayNameDoc) => {
                    return deleteDoc(displayNameDoc.ref);
                });
                return Promise.all(deleteDisplayNamesPromises);
            })
            .then((response) => {
                return deleteUser(currentUser);
            })
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    }

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
                    <div id="profile-image-wrapper">
                        <img src={user.photoURL} alt={`Profile image of ${user.displayName}`} id="profile-image"/>
                    </div>
                    
                    <h1>{user.displayName}</h1>

                    <p>This is your profile page.</p>

                    {!isEditingProfile && !isConfirmDeleteProfileVisible
                        ? <button onClick={handleEditProfile}>Edit</button>
                        : null
                    }
                    
                    {isEditingProfile
                        ? <div>
                            <button onClick={handleCancelEditProfile}>Cancel</button>
                            <button onClick={handleUpdateProfile}>Update</button>
                            <button onClick={handleDeleteProfile}>Delete</button>
                        </div>
                        : null
                    }

                    {isConfirmDeleteProfileVisible
                        ? <div>
                            <div className="confirm">Delete profile? Your account, questions, and comments will be permanently deleted.</div>
                            <button onClick={handleDeleteProfileNo}>No</button>
                            <button onClick={handleDeleteProfileYes}>Yes</button>
                        </div>
                        : null
                    }

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
                            {comments.map((commentObject, index) => {
                                return (
                                    <CommentCard
                                        key={index}
                                        commentObject={commentObject}
                                        page="profile"
                                        user={user}
                                        updateComment={updateComment}
                                        comment={comment}
                                        setComment={setComment}
                                        isEditingQuestion={isEditingQuestion}
                                        setIsEditingQuestion={setIsEditingQuestion}
                                        editingCommentId={editingCommentId}
                                        setEditingCommentId={setEditingCommentId}
                                        setComments={setComments}
                                    />
                                )
                            })}
                        </div>
                        : <div>You haven't posted any comments on any questions.</div>
                    }
                </section>
            </main>
        </>
    )
}