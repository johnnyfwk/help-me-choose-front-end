import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputComment from "../components/InputComment";
import CommentCard from "../components/CommentCard";
import * as utils from '../../utils';

export default function Question({user}) {
    const {question_id} = useParams(null);

    const [question, setQuestion] = useState(null);
    const [getQuestionError, setGetQuestionError] = useState(null);
    const [updateQuestionError, setUpdateQuestionError] = useState(null);

    const [originalQuestion, setOriginalQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentUser, setCurrentUser] = useState(null);
    const [userVote, setUserVote] = useState(null);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState("");
    const [commentsError, setCommentsError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editTitleError, setEditTitleError] = useState("");
    const [editDescriptionError, setEditDescriptionError] = useState("");

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
                    setGetQuestionError(error.message);
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
            .catch((error) => {
                setUpdateQuestionError(error.message);
                console.error('Error updating votes:', error);
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

    function handleEditQuestion() {
        setIsEditing(true);
        setOriginalQuestion({ ...question });
    }

    function handleTitle(event) {
        setEditTitleError("");
        let updatedTitle = question.title;
        updatedTitle = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            title: updatedTitle
        }))
    }

    function handleDescription(event) {
        setEditDescriptionError("");
        let updatedDescription = question.description;
        updatedDescription = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            description: updatedDescription
        }))
    }

    function handleCategory(event) {
        let updatedCategory = question.category;
        updatedCategory = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            category: updatedCategory
        }))
    }

    function handleEditOption(event, index) {
        const updatedOptions = [...question.options];
        updatedOptions[index] = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            options: updatedOptions
        }));
    }

    function handleCancelEditQuestion() {
        setIsEditing(false);
        setQuestion(originalQuestion);
    }

    function handleUpdateQuestion() {
        if (!question || !currentUser) return;

        const { title, description, category, options } = question;
        console.log("Title: ", title);
        console.log("Description: ", description);
        console.log("Category: ", category);

        const optionsCheck = options.filter((option) => option).map((opt) => opt.trim());

        if (!title) {
            setEditTitleError("Please enter a title for your question.");
        }
        if (!description) {
            setEditDescriptionError("Please enter a description for your question.");
        }
        if (optionsCheck.length < 2) {
            console.log("Please enter at least two options.")
        }

        // Identify the indices of removed options
        // const newOptions = question.options.filter((option) => option.trim() !== "");
        // console.log("New Options: ", newOptions)
        // const removedIndices = question.options.reduce((acc, option, index) => {
        //     if (!newOptions.includes(option)) {
        //         acc.push(index);
        //     }
        //     return acc;
        // }, []);
        // console.log("removedIndices: ", removedIndices);

        // Filter out the votes and votedUsers associated with removed options
        // const newVotes = votes.filter((_, index) => !removedIndices.includes(index));
        // const newVotedUsers = votedUsers.filter(vote => !removedIndices.includes(vote.optionIndex));
        // const newOptionsTrimmed = newOptions.map((option) => option.trim());

        // Update the Firestore document with the new options, votes, and votedUsers
        const docRef = doc(db, 'questions', question_id);
        updateDoc(docRef, {
            title: title,
            description: description,
            category: category,
            modified: serverTimestamp()
        })
        .then(() => {
            setQuestion(prevData => ({
                ...prevData,
                title: title,
                description: description,
                category: category,
            }));
            setIsEditing(false);
        })
        .catch((error) => {
            setUpdateQuestionError(error.message);
            console.error('Error updating question:', error);
        });
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (getQuestionError) {
        return <p>Error: {getQuestionError}</p>;
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
                    {isEditing
                        ? <div>
                            <InputTitle
                                title={question.title}
                                handleTitle={handleTitle}
                            />
                            <div className="error">{editTitleError}</div>
                        </div>                        
                        : <h1>{question.title}</h1>
                    }

                    {isEditing
                        ? <div>
                            <InputDescription
                                description={question.description}
                                handleDescription={handleDescription}
                            />
                            <div className="error">{editDescriptionError}</div>
                        </div>
                        : <p>{question.description}</p>
                    }

                    {isEditing
                        ? <div>
                            <InputCategory
                                category={question.category}
                                handleCategory={handleCategory}
                            />
                        </div>
                        : <div>{question.category}</div>
                    }              
                
                    {isEditing
                        ? null
                        : <>
                            <div>{question.ownerUsername}</div>
                            <div>{utils.formatDate(question.created)}</div>
                        </>
                    }
                    

                    {isEditing
                        ? question.options.map((option, index) => {
                            return (
                                <input
                                    key={index}
                                    type="text"
                                    id={`edit-option-${index}`}
                                    name={`edit-option-${index}`}
                                    value={option}
                                    onChange={(event) => handleEditOption(event, index)}
                                    placeholder={`Option ${index + 1}`}
                                />
                            )
                        })
                        : <div className="question-options-wrapper">
                            {question.options.map((option, index) => {
                                return (
                                    <div key={index} className="question-option-wrapper">
                                        <div key={index}>{option}</div>
                                        <div>{question.votes[index]} votes</div>
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
                    }                    

                    {user.uid === question.ownerId && !isEditing
                        ? <button onClick={handleEditQuestion}>Edit</button>
                        : null
                    }

                    {isEditing
                        ? <div>
                            <button onClick={handleCancelEditQuestion}>Cancel</button>
                            <button
                                onClick={handleUpdateQuestion}
                            >Update</button>
                        </div>
                        : null
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
                    {comments.length > 0
                        ? <div className="comments-wrapper">
                            {comments.map((comment, index) => {
                                return <CommentCard key={index} comment={comment} page="question" />
                            })}
                        </div>
                        : <div>There are no comments for this question.</div>
                    }
                </section>
            </main>
        </>
    )
}