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
    const [updateVoteError, setUpdateVoteError] = useState(null);

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
                            const foundIndex = data.questionOptionsAndVoters.findIndex(option => 
                                option.voters.includes(user.uid)
                            );
                            setUserVote(foundIndex !== -1 ? foundIndex : null);
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

        console.log("Logged in User ID: ", user.uid)
        console.log("Question: ", question);

        const updatedOptionsAndVoters = question.questionOptionsAndVoters.map((optionAndVoters, index) => {
            const newVoters = [...optionAndVoters.voters];
    
            if (newVoters.includes(currentUser.uid)) {
                const voterIndex = newVoters.indexOf(currentUser.uid);
                if (voterIndex > -1) {
                    newVoters.splice(voterIndex, 1);
                }
            }
    
            if (index === optionIndex) {
                newVoters.push(currentUser.uid);
            }
    
            return {
                ...optionAndVoters,
                voters: newVoters
            };
        });

        const docRef = doc(db, 'questions', question_id);

        updateDoc(docRef, {
            questionOptionsAndVoters: updatedOptionsAndVoters,
            questionModified: serverTimestamp()
        })
            .then(() => {
                setQuestion(prevData => ({
                    ...prevData,
                    questionOptionsAndVoters: updatedOptionsAndVoters,
                }));
                setUserVote(optionIndex);
            })
            .catch((error) => {
                setUpdateVoteError(error.message);
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
            questionOwnerId: question.questionOwnerId,
            questionOwnerUsername: question.questionOwnerUsername,
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

        // Update the Firestore document with updated question
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
                                title={question.questionTitle}
                                handleTitle={handleTitle}
                            />
                            <div className="error">{editTitleError}</div>
                        </div>                        
                        : <h1>{question.questionTitle}</h1>
                    }

                    {isEditing
                        ? <div>
                            <InputDescription
                                description={question.questionDescription}
                                handleDescription={handleDescription}
                            />
                            <div className="error">{editDescriptionError}</div>
                        </div>
                        : <p>{question.questionDescription}</p>
                    }

                    {isEditing
                        ? <div>
                            <InputCategory
                                category={question.questionCategory}
                                handleCategory={handleCategory}
                            />
                        </div>
                        : <div>{question.questionCategory}</div>
                    }              
                
                    {isEditing
                        ? null
                        : <>
                            <div>{question.questionOwnerUsername}</div>
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
                            {question.questionOptionsAndVoters.map((optionAndVoters, index) => {
                                return (
                                    <div key={index} className="question-option-wrapper">
                                        <div key={index}>{optionAndVoters.name}</div>
                                        <div>{optionAndVoters.voters.length} votes</div>
                                        {!currentUser || question.questionOwnerId === currentUser.uid
                                            ? null
                                            : <button
                                                onClick={() => handleVote(index)}
                                                disabled={userVote === index}
                                            >{userVote === index ? 'Voted' : 'Vote'}</button>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    }                    

                    {/* {user.uid === question.questionOwnerId && !isEditing
                        ? <button onClick={handleEditQuestion}>Edit</button>
                        : null
                    } */}

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