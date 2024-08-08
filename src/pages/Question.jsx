import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { db, auth } from '../firebase';
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    addDoc,
    collection,
    query,
    where,
    onSnapshot,
    orderBy
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import InputComment from "../components/InputComment";
import CommentCard from "../components/CommentCard";
import * as utils from '../../utils';

export default function Question() {
    const { user, loading } = useAuth();

    const {question_id} = useParams(null);

    const [question, setQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userVote, setUserVote] = useState(null);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState("");
    const [commentsError, setCommentsError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        const fetchQuestion = () => {
            const docRef = doc(db, 'questions', question_id);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setQuestion(data);
                        if (user) {
                            setUserVote(data.votedUsers.find(vote => vote.userId === user.uid)?.optionIndex);
                        }
                    } else {
                        console.log("Question doesn't exist.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setError(error.message);
                    console.error('Error fetching question:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                })
        };

        const fetchComments = () => {
            const q = query(
                collection(db, 'comments'),
                where('questionId', '==', question_id),
                orderBy('commentCreated', 'desc')
            );

            const unsubscribeComments = onSnapshot(q, (querySnapshot) => {
                const matchingComments = [];
                querySnapshot.forEach(doc => {
                    matchingComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(matchingComments);
            }, (error) => {
                console.error("Error fetching comments: ", error);
                setCommentsError("Comments could not be fetched.");
            });

            return unsubscribeComments;
        };

        fetchQuestion();
        const unsubscribeComments = fetchComments();

        return () => {
            unsubscribe();
            unsubscribeComments();
        };
    }, [question_id, user]);

    function handleVote(optionIndex) {
        if (!question || !currentUser) return;

        const { votes, votedUsers } = question;

        const previousVote = votedUsers.find(vote => vote.userId === currentUser.uid);

        const newVotes = [...votes];
        if (previousVote) {
            newVotes[previousVote.optionIndex] -= 1;
        }

        newVotes[optionIndex] += 1;

        const updatedVotedUsers = votedUsers.filter(vote => vote.userId !== currentUser.uid);
        updatedVotedUsers.push({ userId: currentUser.uid, username: currentUser.displayName, optionIndex });

        const docRef = doc(db, 'questions', question_id);

        updateDoc(docRef, {
            votes: newVotes,
            votedUsers: updatedVotedUsers,
            modified: serverTimestamp()
        })
            .then(() => {
                setQuestion(prevData => ({
                    ...prevData,
                    votes: newVotes,
                    votedUsers: updatedVotedUsers
                }));
                setUserVote(optionIndex);
            })
            .catch((err) => {
                setError(err.message);
                console.error('Error updating votes:', err);
            });
    }

    function handlePostComment() {
        addDoc(collection(db, 'comments'), {
            comment: comment.trim(),
            commentOwnerId: user.uid,
            commentOwnerUsername: user.displayName,
            commentCreated: serverTimestamp(),
            commentModified: "",
            questionId: question_id,
            questionOwnerId: question.ownerId,
            questionOwnerUsername: question.ownerUsername,
            questionTitle: question.title,
            questionDescription: question.description,
            questionCategory: question.category,
            questionCreated: question.created,
            questionModified: question.modified,
        })
        .then((response) => {
            console.log("Comment posted successfully");
            console.log(response);
            setComment("");
            setCommentError("");
            const questionRef = doc(db, 'questions', question_id);
            updateDoc(questionRef, {
                modified: serverTimestamp()
            })
        })
        .catch((error) => {
            console.log(error);
            console.error('Error posting comment: ', error);
            setCommentError("Comment could not be posted.");
        })
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/question/post" />
                <title>Question • HelpMeChoose.uk</title>                
                <meta name="description" content="Question description." />
            </Helmet>

            <main>
                <section>
                    {question
                        ? <>
                            <h1>{question.title}</h1>
                            <p>{question.description}</p>
                            <div>{question.ownerUsername}</div>
                            <div>{question.category}</div>
                            <div>{utils.formatDate(question.created)}</div>
                            <div className="question-options-wrapper">
                                {question.options.map((option, index) => {
                                    return (
                                        <div key={index} className="question-option-wrapper">
                                            <div key={index}>{option} - {question.votes[index]} votes</div>
                                            {!currentUser || question.ownerId === currentUser.uid
                                                ? null
                                                : <button
                                                    onClick={() => handleVote(index)}
                                                >{userVote === index ? 'Voted' : 'Vote'}</button>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                        : <div className="error">Question does not exist.</div>
                    }
                </section>
                
                {currentUser
                    ? <section>
                        <h2>Add a Comment</h2>
                        <p>Add a comment and help the poster make a choice.</p>

                        <InputComment
                            comment={comment}
                            setComment={setComment}
                        />

                        <div className="error">{commentError}</div>

                        <input
                            type="button"
                            value="Post Comment"
                            onClick={handlePostComment}
                            disabled={!comment}
                        ></input>
                    </section>
                    : null
                }
                
                <section>
                    <h2>Comments</h2>
                    <div className="error">{commentsError}</div>
                    {comments.length !== 0
                        ? <div className="comments-wrapper">
                            {comments.map((comment, index) => {
                                return <CommentCard key={index} comment={comment} />
                            })}
                        </div>
                        : <div>There are no comments for this question.</div>
                    }
                </section>
            </main>
        </>
    )
}