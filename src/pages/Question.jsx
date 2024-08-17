import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db, auth } from '../firebase';
import {
    doc,
    getDoc,
    getDocs,
    updateDoc,
    serverTimestamp,
    addDoc,
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputComment from "../components/InputComment";
import InputOptions from "../components/InputOptions";
import CommentCard from "../components/CommentCard";
import * as utils from '../../utils';

export default function Question({user}) {
    const [isLoading, setIsLoading] = useState(true);

    const {question_id} = useParams(null);

    const [question, setQuestion] = useState(null);
    const [originalQuestion, setOriginalQuestion] = useState(null);
    const [getQuestionError, setGetQuestionError] = useState(null);
    const [updateQuestionError, setUpdateQuestionError] = useState(null);
    const [updateVoteError, setUpdateVoteError] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);
    const [userVote, setUserVote] = useState("");

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState("");
    const [commentsError, setCommentsError] = useState("");

    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editTitleError, setEditTitleError] = useState("");
    const [editDescriptionError, setEditDescriptionError] = useState("");
    const [editOptionsError, setEditOptionsError] = useState("");

    const [isConfirmDeleteQuestionVisible, setIsConfirmDeleteQuestionVisible] = useState(false);

    const [optionsError, setOptionsError] = useState("");
    const [optionImageUrlError, setOptionImageUrlError] = useState({imageUrls: [], msg: "Image URL is not valid"});

    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const navigate = useNavigate();

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
                            const usersVote = data.questionOptions.find((option) => option.votes.includes(user.uid));
                            setUserVote(usersVote ? usersVote.name : "");
                        }
                    } else {
                        console.log("Question doesn't exist.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setGetQuestionError("Could not get question.");
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

    function handleVote(vote) {
        if (!question || !currentUser) return;

        const updatedQuestionOptions = question.questionOptions.map((option) => {
            const updatedOption = { ...option };
            if (updatedOption.votes.includes(user.uid)) {
                updatedOption.votes = updatedOption.votes.filter(uid => uid !== user.uid);
            }
            if (vote === updatedOption.name) {
                updatedOption.votes = [...updatedOption.votes, user.uid];
            }
            return updatedOption;
        });

        const docRef = doc(db, 'questions', question_id);

        updateDoc(docRef, {
            questionOptions: updatedQuestionOptions,
            questionModified: serverTimestamp()
        })
            .then(() => {
                setQuestion((prevQuestion) => ({
                    ...prevQuestion,
                    questionOptions: updatedQuestionOptions,
                }));
                setUserVote(vote);
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
            commentOwnerImageUrl: user.photoURL,
            commentLikes: [],
            commentCreated: serverTimestamp(),
            commentModified: "",
            questionId: question_id,
            questionOwnerId: question.questionOwnerId,
            questionOwnerUsername: question.questionOwnerUsername,
            questionTitle: question.questionTitle,
            questionDescription: question.questionDescription,
            questionCategory: question.questionCategory,
            questionCreated: question.questionCreated,
            questionModified: question.questionModified,
        })
        .then((response) => {
            setComment("");
            setCommentError("");
            const questionRef = doc(db, 'questions', question_id);
            updateDoc(questionRef, {
                questionModified: serverTimestamp()
            })
        })
        .catch((error) => {
            console.log(error);
            console.error('Error posting comment: ', error);
            setCommentError("Comment could not be posted.");
        })
    }

    function handleEditQuestion() {
        window.scrollTo(0, 0);
        setIsEditingQuestion(true);
        setOriginalQuestion(structuredClone(question));
        setEditOptionsError("");
        setComment("");
    }

    function handleTitle(event) {
        setEditTitleError("");
        let updatedTitle = question.questionTitle;
        updatedTitle = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            questionTitle: updatedTitle
        }))
    }

    function handleDescription(event) {
        setEditDescriptionError("");
        let updatedDescription = question.questionDescription;
        updatedDescription = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            questionDescription: updatedDescription
        }))
    }

    function handleCategory(event) {
        let updatedCategory = question.questionCategory;
        updatedCategory = event.target.value;
        setQuestion(prevData => ({
            ...prevData,
            questionCategory: updatedCategory
        }))
    }

    function handleOptionNames(index, value) {
        const questionCopy = structuredClone(question);
        questionCopy.questionOptions[index].name = value;
        setQuestion(questionCopy);
        setOptionsError("");
    }

    function handleOptionImages(index, value) {
        const questionCopy = structuredClone(question);
        questionCopy.questionOptions[index].imageUrl = value;
        setQuestion(questionCopy);
        setOptionsError("");
    }

    function handleAddOption() {
        const questionCopy = structuredClone(question);
        questionCopy.questionOptions.push(
            {name: "", imageUrl: "", votes: []}
        );
        setQuestion(questionCopy);
    }

    function handleCancelEditQuestion() {
        setIsEditingQuestion(false);
        setQuestion(structuredClone(originalQuestion));
        setEditOptionsError("");
    }

    function handleUpdateQuestion() {
        if (!question || !currentUser) return;

        setEditOptionsError("");

        const { questionTitle, questionDescription, questionCategory } = question;

        const updatedOptions = question.questionOptions.filter((option) => option.name);
        
        const updatedOptionsTrimmed = updatedOptions.map((option) => {
            const newOption = {};
            newOption.name = option.name.trim();
            newOption.imageUrl = option.imageUrl.trim();
            newOption.votes = [...option.votes];
            return newOption;
        })

        if (!questionTitle) {
            setEditTitleError("Please enter a title for your question.");
            return;
        }
        if (!questionDescription) {
            setEditDescriptionError("Please enter a description for your question.");
            return;
        }
        if (updatedOptionsTrimmed.length < 2) {
            setEditOptionsError("Please enter at least two options.");
            return;
        }

        const invalidImageUrls = [];

        const validateImageUrls = updatedOptionsTrimmed.map((option) => {
            if (option.imageUrl) {
                return utils.validateImageUrl(option.imageUrl)
                    .then((response) => {
                        if (!response) {
                            invalidImageUrls.push(option.imageUrl);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        invalidImageUrls.push(option.imageUrl);
                    })
            } else {
                return Promise.resolve();
            }
        });

        Promise.all(validateImageUrls)
            .then(() => {
                if (invalidImageUrls.length > 0) {
                    setOptionImageUrlError({
                        imageUrls: invalidImageUrls,
                        msg: "Image URL is not valid."
                    });
                    return;
                }

                const docRef = doc(db, 'questions', question_id);
                updateDoc(docRef, {
                    questionTitle: questionTitle.trim(),
                    questionDescription: questionDescription.trim(),
                    questionCategory,
                    questionOptions: updatedOptionsTrimmed,
                    questionModified: serverTimestamp()
                })
                .then(() => {
                    setQuestion(prevQuestion => ({
                        ...prevQuestion,
                        questionTitle: questionTitle.trim(),
                        questionDescription: questionDescription.trim(),
                        questionCategory,
                        questionOptions: updatedOptionsTrimmed
                    }));
                    setIsEditingQuestion(false);
                    setEditTitleError("");
                    setEditDescriptionError("");
                    setEditOptionsError("");
                    setUpdateQuestionError("");
                })
                .catch((error) => {
                    setUpdateQuestionError(error.message);
                    console.error('Error updating question:', error);
                });
            })
    }

    function handleComment(event) {
        setIsEditingQuestion(false);
        setComment(event.target.value);
    }

    function updateComment(updatedComment) {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id
                    ? updatedComment
                    : comment
            )
        );
    }

    function handleDeleteQuestion() {
        setIsEditingQuestion(false);
        setIsConfirmDeleteQuestionVisible(true);
    }

    function handleDeleteQuestionNo() {
        console.log("Delete: No")
        setIsConfirmDeleteQuestionVisible(false);
    }

    function handleDeleteQuestionYes() {
        setIsConfirmDeleteQuestionVisible(false);

        const questionRef = doc(db, 'questions', question_id);
        const commentsQuery = query(
            collection(db, 'comments'),
            where('questionId', '==', question_id)
        );

        getDocs(commentsQuery)
            .then((commentsSnapshot) => {
                const deleteCommentPromises = commentsSnapshot.docs.map((commentDoc) => {
                    return deleteDoc(commentDoc.ref);
                });
                return Promise.all(deleteCommentPromises);
            })
            .then((response) => {
                console.log(response);
                return deleteDoc(questionRef);
            })
            .then((response) => {
                console.log(response);
                console.log('Question and its comments have been deleted successfully.');
                navigate('/');
            })
            .catch((error) => {
                console.error('Error deleting question and comments:', error);
            });
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (getQuestionError) {
        return <p>{getQuestionError}</p>;
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/question/post" />
                <title>{question.questionTitle} • HelpMeChoose.uk</title>                
                <meta name="description" content="Question description." />
            </Helmet>

            <main>
                <section>
                    {isEditingQuestion
                        ? <div>
                            <div className="error">{editTitleError}</div>
                            <InputTitle
                                title={question.questionTitle}
                                handleTitle={handleTitle}
                            />
                        </div>                        
                        : <h1>{question.questionTitle}</h1>
                    }

                    {isEditingQuestion
                        ? <div>
                            <div className="error">{editDescriptionError}</div>
                            <InputDescription
                                description={question.questionDescription}
                                handleDescription={handleDescription}
                            />
                        </div>
                        : <p>{question.questionDescription}</p>
                    }

                    {isEditingQuestion
                        ? <div>
                            <InputCategory
                                category={question.questionCategory}
                                handleCategory={handleCategory}
                            />
                        </div>
                        : <div>{question.questionCategory}</div>
                    }              
                
                    {isEditingQuestion
                        ? null
                        : <>
                            <Link to={`/profile/${question.questionOwnerId}`}>
                                <div className="question-owner-image-wrapper">
                                    <img
                                        src={question.questionOwnerImageUrl}
                                        alt={`Profile image of ${question.questionOwnerUsername}`}
                                        className="question-owner-image"
                                    />
                                </div>
                            </Link>                                     
                            <Link to={`/profile/${question.questionOwnerId}`}>{question.questionOwnerUsername}</Link>
                            <div>{utils.formatDate(question.questionCreated)}</div>
                        </>
                    }
                    
                    <div className="error">{editOptionsError}</div>
                    <div className="error">{updateVoteError}</div>

                    {isConfirmDeleteQuestionVisible
                        ? <div>
                            <div className="confirm">Delete question? All votes and comments will also be deleted and can't be recovered.</div>
                            <button onClick={handleDeleteQuestionNo}>No</button>
                            <button onClick={handleDeleteQuestionYes}>Yes</button>
                        </div>
                        : null
                    }

                    {isEditingQuestion
                        ? <div>
                            <InputOptions
                                options={question.questionOptions}
                                handleOptionNames={handleOptionNames}
                                handleOptionImages={handleOptionImages}
                                optionImageUrlError={optionImageUrlError}
                            />
                            {question.questionOptions.length < 5
                                ? <button onClick={handleAddOption}>Add Option</button>
                                : null
                            }
                        </div>
                        : <div className="question-options-wrapper">
                            {question.questionOptions.map((option, index) => {
                                return (
                                    <div key={index} className="question-option-wrapper">
                                        <div key={index}>{option.name}</div>

                                        {option.imageUrl
                                            ? <img src={option.imageUrl} alt={option.name} className="question-option-image"/>
                                            : null
                                        }
                                        
                                        <div>{option.votes.length} votes</div>

                                        {!user
                                            ? null
                                            : user.emailVerified && question.questionOwnerId !== user.uid
                                                ? <button
                                                    onClick={() => handleVote(option.name)}
                                                    disabled={userVote === option.name}
                                                >{userVote === option.name ? 'Voted' : 'Vote'}</button>
                                                : null
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    }

                    <div className="error">{updateQuestionError}</div>   

                    {user &&
                    user.emailVerified &&
                    user.uid === question.questionOwnerId &&
                    !isEditingQuestion &&
                    !isConfirmDeleteQuestionVisible
                        ? <button onClick={handleEditQuestion}>Edit</button>
                        : null
                    }

                    {isEditingQuestion
                        ? <div>
                            <button onClick={handleCancelEditQuestion}>Cancel</button>
                            <button onClick={handleUpdateQuestion}>Update</button>
                            <button onClick={handleDeleteQuestion}>Delete</button>
                        </div>
                        : null
                    }
                </section>

                {!user
                    ? null
                    : user.emailVerified
                        ? <section>
                            <h2>Comments</h2>

                            <InputComment
                                comment={comment}
                                handleComment={handleComment}
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
                
                {/* {user.emailVerified
                    ? <section>
                        <h2>Comments</h2>

                        <InputComment
                            comment={comment}
                            handleComment={handleComment}
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
                } */}
                
                <section>
                    <div className="error">{commentsError}</div>
                    {comments.length > 0
                        ? <div className="comments-wrapper">
                            {comments.map((commentObject, index) => {
                                return (
                                    <CommentCard
                                        key={index}
                                        commentObject={commentObject}
                                        page="question"
                                        user={user}
                                        updateComment={updateComment}
                                        comment={comment}
                                        setComment={setComment}
                                        isEditingQuestion={isEditingQuestion}
                                        setIsEditingQuestion={setIsEditingQuestion}
                                        editingCommentId={editingCommentId}
                                        setEditingCommentId={setEditingCommentId}
                                        setComments={setComments}
                                        setIsEditingProfileImage={setIsEditingProfileImage}
                                        setIsChangingPassword={setIsChangingPassword}
                                        setIsDeletingAccount={setIsDeletingAccount}
                                    />
                                )
                            })}
                        </div>
                        : <div>There are no comments for this question.</div>
                    }
                </section>
            </main>
        </>
    )
}