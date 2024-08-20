import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db } from '../firebase';
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
    orderBy,
    deleteDoc,
    limit,
    getCountFromServer,
    startAfter,
    onSnapshot
} from 'firebase/firestore';
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputComment from "../components/InputComment";
import InputOptions from "../components/InputOptions";
import CommentCard from "../components/CommentCard";
import QuestionCard from "../components/QuestionCard";
import * as utils from '../../utils';

export default function Question({
    user,
    setCategory,
    setHomepageQuestionPage,
    setIsPostCommentSuccessMessageVisible,
    setIsQuestionUpdatedSuccessMessageVisible,
    setIsCommentUpdatedSuccessMessageVisible,
    setIsCommentUpdatedErrorMessageVisible,
    setIsCommentDeletedSuccessMessageVisible,
    setIsCommentDeletedErrorMessageVisible,
    setIsQuestionDeletedSuccessMessageVisible
}) {
    const [isLoading, setIsLoading] = useState(true);

    const {question_id} = useParams(null);

    const [question, setQuestion] = useState(null);
    const [originalQuestion, setOriginalQuestion] = useState(null);
    const [getQuestionError, setGetQuestionError] = useState(null);
    const [updateQuestionError, setUpdateQuestionError] = useState(null);
    const [updateVoteError, setUpdateVoteError] = useState(null);
    const [deleteQuestionError, setDeleteQuestionError] = useState("");

    const [userVote, setUserVote] = useState("");

    const [comment, setComment] = useState("");
    const [postCommentError, setPostCommentError] = useState("");

    const commentsPerPage = 1;
    const [comments, setComments] = useState([]);    
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const totalCommentsPages = Math.ceil(totalComments / commentsPerPage);
    const [fetchCommentsError, setFetchCommentsError] = useState("");
    
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editTitleError, setEditTitleError] = useState("");
    const [editDescriptionError, setEditDescriptionError] = useState("");
    const [editOptionsError, setEditOptionsError] = useState("");

    const latestAndRelatedCards = 10;
    const [latestQuestions, setLatestQuestions] = useState([]);
    const [fetchLatestQuestionsError, setFetchLatestQuestionsError] = useState("");

    const [relatedQuestions, setRelatedQuestions] = useState([]);
    const [fetchRelatedQuestionsError, setFetchRelatedQuestionsError] = useState("");

    const [optionsError, setOptionsError] = useState("");
    const [optionImageUrlError, setOptionImageUrlError] = useState({imageUrls: [], msg: "Image URL is not valid"});

    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isConfirmDeleteQuestionVisible, setIsConfirmDeleteQuestionVisible] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setCommentsPage(1);
        window.scrollTo(0, 0);

        const fetchCommentCount = () => {
            const commentsRef = collection(db, "comments");

            const commentsQuery = query(
                commentsRef,
                where("questionId", "==", question_id)
            );
            utils.getDocumentCount(getCountFromServer, commentsQuery, setTotalComments);
        };

        const fetchQuestionAndRelatedQuestions = () => {
            const questionRef = doc(db, 'questions', question_id);
            getDoc(questionRef)
                .then((questionSnap) => {
                    if (questionSnap.exists()) {
                        const data = questionSnap.data();
                        setQuestion(data);
                        if (user) {
                            const usersVote = data.questionOptions.find((option) => option.votes.includes(user.uid));
                            setUserVote(usersVote ? usersVote.name : "");
                        }
                        return data;
                    } else {
                        console.log("Question doesn't exist.");
                    }
                })
                .then((question) => {
                    const relatedQuestionsRef = collection(db, 'questions');

                    const q = query(
                        relatedQuestionsRef,
                        where('questionCategory', '==', question.questionCategory),
                        orderBy('questionModified', 'desc'),                
                        limit(latestAndRelatedCards)
                    );

                    return getDocs(q)
                })
                .then((relatedQuestions) => {
                    const similarQuestions = [];

                    relatedQuestions.forEach((doc) => {
                        if (doc.id !== question_id) {
                            similarQuestions.push({ id: doc.id, ...doc.data() });
                        }
                    });
                    setRelatedQuestions(similarQuestions);
                })
                .catch((error) => {
                    setGetQuestionError("Could not get question.");
                    setFetchRelatedQuestionsError("Could not fetch related questions.");
                })
                .finally(() => {
                    setIsLoading(false);
                })
        };

        const fetchLatestPosts = () => {
            const latestQuestionsRef = collection(db, 'questions');

            const q = query(
                latestQuestionsRef,
                orderBy('questionModified', 'desc'),
                limit(latestAndRelatedCards)
            );

            getDocs(q)
                .then((querySnapshot) => {
                    const newestQuestions = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.id !== question_id) {
                            newestQuestions.push({ id: doc.id, ...doc.data() });
                        }
                    });
                    setLatestQuestions(newestQuestions);
                })
                .catch((error) => {
                    setFetchLatestQuestionsError("Could not fetch the latest questions.");
                });
        };

        const unsubscribe = onSnapshot(
            query(
                collection(db, 'comments'),
                where('questionId', '==', question_id),
                orderBy('commentCreated', 'desc'),
                limit(commentsPerPage)
            ),
            (snapshot) => {
                const newComments = [];
                snapshot.forEach((doc) => {
                    newComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(newComments);
            },
            (error) => {
                setFetchCommentsError("Error fetching comments: " + error.message);
            }
        );

        fetchQuestionAndRelatedQuestions();
        fetchLatestPosts();
        fetchCommentCount();

        return () => unsubscribe();
    }, [question_id]);

    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetchingComments,
            collection,
            db,
            'comments',
            commentsPage,
            query,
            question_id,
            question_id,
            where,
            "questionId",
            orderBy,
            'commentCreated',
            limit,
            commentsPerPage,
            getDocs,
            startAfter,
            setComments,
            setFetchCommentsError,
        );
    }, [question_id, commentsPage]);

    function handleVote(vote) {
        if (!question || !user) return;

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

        const questionsRef = doc(db, 'questions', question_id);

        updateDoc(questionsRef, {
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
            });
    }

    function handlePostComment() {
        const newComment = {
            comment: comment.trim(),
            commentOwnerId: user.uid,
            commentOwnerUsername: user.displayName,
            commentOwnerImageUrl: user.photoURL,
            commentLikes: [],
            commentCreated: serverTimestamp(),
            commentModified: serverTimestamp(),
            questionId: question_id,
            questionOwnerId: question.questionOwnerId,
            questionOwnerUsername: question.questionOwnerUsername,
            questionTitle: question.questionTitle,
            questionDescription: question.questionDescription,
            questionCategory: question.questionCategory,
            questionCreated: question.questionCreated,
            questionModified: serverTimestamp()
        };

        addDoc(collection(db, 'comments'), newComment)
            .then((response) => {
                setIsPostCommentSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsPostCommentSuccessMessageVisible(false);
                }, 3000);
                setComment("");
                setPostCommentError("");
                setCommentsPage(1);
                setTotalComments((currentTotalComments) => currentTotalComments + 1);
                const questionRef = doc(db, 'questions', question_id);                
                updateDoc(questionRef, {
                    questionModified: serverTimestamp()
                })
            })
            .catch((error) => {
                setPostCommentError("Comment could not be posted.");
            })
    }

    function handleEditQuestion() {
        window.scrollTo(0, 0);
        setIsEditingQuestion(true);
        setOriginalQuestion(structuredClone(question));
        setEditOptionsError("");
        setComment("");
        setDeleteQuestionError("");
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
        if (!question || !user) return;

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

                const questionsRef = doc(db, 'questions', question_id);
                updateDoc(questionsRef, {
                    questionTitle: questionTitle.trim(),
                    questionDescription: questionDescription.trim(),
                    questionCategory,
                    questionOptions: updatedOptionsTrimmed,
                    questionModified: serverTimestamp()
                })
                .then((response) => {
                    setIsQuestionUpdatedSuccessMessageVisible(true);
                    setTimeout(() => {
                        setIsQuestionUpdatedSuccessMessageVisible(false);
                    }, 3000);
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
                    setUpdateQuestionError("Your question could not be updated.");
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
                return deleteDoc(questionRef);
            })
            .then((response) => {
                setIsQuestionDeletedSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsQuestionDeletedSuccessMessageVisible(false);
                }, 3000);
                setDeleteQuestionError("");
                navigate('/');
            })
            .catch((error) => {
                setDeleteQuestionError("Your question could not be deleted.");
            });
    }

    function handleQuestionCategory(category) {
        setCategory(category);
    }

    function handleQuestionCardCategory(category) {
        setHomepageQuestionPage(1);
        setCategory(category);
    }

    function handleQuestionCardTitle() {
        setCommentsPage(1);
    }

    function handleCommentsPageChange(newPage) {
        if (newPage > 0 && newPage <= totalCommentsPages) {
            setCommentsPage(newPage);
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!question) {
        return null;
    }

    if (getQuestionError) {
        return <p>{getQuestionError}</p>;
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://helpmechoose.uk/question/${question_id}`} />
                <title>{question.questionTitle} • HelpMeChoose.uk</title>                
                <meta name="description" content={question.questionDescription} />
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
                        : <Link
                            to={`/?category=${utils.convertToSlug(question.questionCategory)}`}
                            onClick={() => handleQuestionCategory(question.questionCategory)}
                        >{question.questionCategory}</Link>
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
                    <div className="error">{updateQuestionError}</div>   
                    <div className="error">{deleteQuestionError}</div>

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

                <section>
                    <h2>Comments</h2>

                    {!user
                        ? null
                        : user.emailVerified
                            ? <>
                                <div className="error">{postCommentError}</div>

                                <InputComment
                                    comment={comment}
                                    handleComment={handleComment}
                                />

                                <input
                                    type="button"
                                    value="Post Comment"
                                    onClick={handlePostComment}
                                    disabled={!comment}
                                ></input>
                            </>
                            : null
                    }

                    <>
                        <div className="error">{fetchCommentsError}</div>

                        {comments.length > 0
                            ? <>
                                <div className="comments-wrapper">
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
                                                setIsCommentUpdatedSuccessMessageVisible={setIsCommentUpdatedSuccessMessageVisible}
                                                setIsCommentUpdatedErrorMessageVisible={setIsCommentUpdatedErrorMessageVisible}
                                                setIsCommentDeletedSuccessMessageVisible={setIsCommentDeletedSuccessMessageVisible}
                                                setIsCommentDeletedErrorMessageVisible={setIsCommentDeletedErrorMessageVisible}
                                                setCommentsPage={setCommentsPage}
                                                setTotalComments={setTotalComments}
                                            />
                                        )
                                    })}
                                </div>
                                <div>
                                    <button onClick={() => handleCommentsPageChange(commentsPage - 1)} disabled={isFetchingComments || commentsPage === 1}>Previous</button>
                                    <span>Page {commentsPage} of {totalCommentsPages}</span>
                                    <button onClick={() => handleCommentsPageChange(commentsPage + 1)} disabled={isFetchingComments || commentsPage === totalCommentsPages}>Next</button>
                                </div>
                            </>
                            : <div>There are no comments for this question.</div>
                        }
                    </>
                </section>

                <section>
                    <h2>Latest Questions</h2>

                    <div className="error">{fetchLatestQuestionsError}</div>

                    {latestQuestions.length === 0
                        ? <div>There are no questions to display.</div>
                        : <div className="question-cards-wrapper">
                            {latestQuestions.map((question, index) => {
                                return (
                                    <QuestionCard
                                        key={index}
                                        question={question}
                                        page="question"
                                        handleQuestionCardCategory={handleQuestionCardCategory}
                                        handleQuestionCardTitle={handleQuestionCardTitle}
                                    />
                                )
                            })}
                        </div>
                    }
                </section>

                <section>
                    <h2>Related Questions</h2>

                    <div className="error">{fetchRelatedQuestionsError}</div>

                    {relatedQuestions.length === 0
                        ? <div>There are no related questions.</div>
                        : <div className="question-cards-wrapper">
                            {relatedQuestions.map((question, index) => {
                                return (
                                    <QuestionCard
                                        key={index}
                                        question={question}
                                        page="question"
                                        handleQuestionCardCategory={handleQuestionCardCategory}
                                        handleQuestionCardTitle={handleQuestionCardTitle}
                                    />
                                )
                            })}
                        </div>
                    }
                </section>
            </main>
        </>
    )
}