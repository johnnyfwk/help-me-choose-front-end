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
import PollCard from "../components/PollCard";
import * as utils from '../../utils';

export default function Poll({
    user,
    setCategory,
    setHomepagePollPage,
    setIsPostCommentSuccessMessageVisible,
    setIsPollUpdatedSuccessMessageVisible,
    setIsCommentUpdatedSuccessMessageVisible,
    setIsCommentUpdatedErrorMessageVisible,
    setIsCommentDeletedSuccessMessageVisible,
    setIsCommentDeletedErrorMessageVisible,
    setIsPollDeletedSuccessMessageVisible
}) {
    const [isLoading, setIsLoading] = useState(true);

    const {poll_id} = useParams(null);

    const [poll, setPoll] = useState(null);
    const [originalPoll, setOriginalPoll] = useState(null);
    const [getPollError, setGetPollError] = useState(null);
    const [updatePollError, setUpdatePollError] = useState(null);
    const [updateVoteError, setUpdateVoteError] = useState(null);
    const [deletePollError, setDeletePollError] = useState("");

    const [userVote, setUserVote] = useState("");

    const [comment, setComment] = useState("");
    const [postCommentError, setPostCommentError] = useState("");

    const commentsPerPage = 10;
    const [comments, setComments] = useState([]);    
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [commentsPage, setCommentsPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const totalCommentsPages = Math.ceil(totalComments / commentsPerPage);
    const [fetchCommentsError, setFetchCommentsError] = useState("");
    
    const [isEditingPoll, setIsEditingPoll] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editTitleError, setEditTitleError] = useState("");
    const [editDescriptionError, setEditDescriptionError] = useState("");
    const [editOptionsError, setEditOptionsError] = useState("");

    const latestAndRelatedCards = 10;
    const [latestPolls, setLatestPolls] = useState([]);
    const [fetchLatestPollsError, setFetchLatestPollsError] = useState("");

    const [relatedPolls, setRelatedPolls] = useState([]);
    const [fetchRelatedPollsError, setFetchRelatedPollsError] = useState("");

    const [optionsError, setOptionsError] = useState("");
    const [optionImageUrlError, setOptionImageUrlError] = useState({imageUrls: [], msg: "Image URL is not valid"});

    const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isConfirmDeletePollVisible, setIsConfirmDeletePollVisible] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setCommentsPage(1);
        window.scrollTo(0, 0);

        const fetchCommentCount = () => {
            const commentsRef = collection(db, "comments");

            const commentsQuery = query(
                commentsRef,
                where("pollId", "==", poll_id)
            );
            utils.getDocumentCount(getCountFromServer, commentsQuery, setTotalComments);
        };

        const fetchPollAndRelatedPolls = () => {
            const pollRef = doc(db, 'polls', poll_id);
            getDoc(pollRef)
                .then((pollSnap) => {
                    if (pollSnap.exists()) {
                        const data = pollSnap.data();
                        setPoll(data);
                        if (user) {
                            const usersVote = data.pollOptions.find((option) => option.votes.includes(user.uid));
                            setUserVote(usersVote ? usersVote.name : "");
                        }
                        return data;
                    } else {
                        console.log("Poll doesn't exist.");
                        navigate("/");
                    }
                })
                .then((poll) => {
                    const relatedPollsRef = collection(db, 'polls');

                    const q = query(
                        relatedPollsRef,
                        where('pollCategory', '==', poll.pollCategory),
                        orderBy('pollModified', 'desc'),                
                        limit(latestAndRelatedCards)
                    );

                    return getDocs(q)
                })
                .then((relatedPolls) => {
                    const similarPolls = [];

                    relatedPolls.forEach((doc) => {
                        if (doc.id !== poll_id) {
                            similarPolls.push({ id: doc.id, ...doc.data() });
                        }
                    });
                    setRelatedPolls(similarPolls);
                })
                .catch((error) => {
                    setGetPollError("Could not get poll.");
                    setFetchRelatedPollsError("Could not fetch related polls.");
                })
                .finally(() => {
                    setIsLoading(false);
                })
        };

        const fetchLatestPosts = () => {
            const latestPollsRef = collection(db, 'polls');

            const q = query(
                latestPollsRef,
                orderBy('pollModified', 'desc'),
                limit(latestAndRelatedCards)
            );

            getDocs(q)
                .then((querySnapshot) => {
                    const newestPolls = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.id !== poll_id) {
                            newestPolls.push({ id: doc.id, ...doc.data() });
                        }
                    });
                    setLatestPolls(newestPolls);
                })
                .catch((error) => {
                    setFetchLatestPollsError("Could not fetch the latest polls.");
                });
        };

        const unsubscribe = onSnapshot(
            query(
                collection(db, 'comments'),
                where('pollId', '==', poll_id),
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

        fetchPollAndRelatedPolls();
        fetchLatestPosts();
        fetchCommentCount();

        return () => unsubscribe();
    }, [poll_id]);

    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetchingComments,
            collection,
            db,
            'comments',
            commentsPage,
            query,
            poll_id,
            poll_id,
            where,
            "pollId",
            orderBy,
            'commentCreated',
            limit,
            commentsPerPage,
            getDocs,
            startAfter,
            setComments,
            setFetchCommentsError,
        );
    }, [poll_id, commentsPage]);

    function handleVote(vote) {
        if (!poll || !user) return;

        const updatedPollOptions = poll.pollOptions.map((option) => {
            const updatedOption = { ...option };
            if (updatedOption.votes.includes(user.uid)) {
                updatedOption.votes = updatedOption.votes.filter(uid => uid !== user.uid);
            }
            if (vote === updatedOption.name) {
                updatedOption.votes = [...updatedOption.votes, user.uid];
            }
            return updatedOption;
        });

        const pollsRef = doc(db, 'polls', poll_id);

        updateDoc(pollsRef, {
            pollOptions: updatedPollOptions,
            pollModified: serverTimestamp()
        })
            .then(() => {
                setPoll((prevPoll) => ({
                    ...prevPoll,
                    pollOptions: updatedPollOptions,
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
            pollId: poll_id,
            pollOwnerId: poll.pollOwnerId,
            pollOwnerUsername: poll.pollOwnerUsername,
            pollTitle: poll.pollTitle,
            pollDescription: poll.pollDescription,
            pollCategory: poll.pollCategory,
            pollCreated: poll.pollCreated,
            pollModified: serverTimestamp()
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
                const pollRef = doc(db, 'polls', poll_id);                
                updateDoc(pollRef, {
                    pollModified: serverTimestamp()
                })
            })
            .catch((error) => {
                setPostCommentError("Comment could not be posted.");
            })
    }

    function handleEditPoll() {
        window.scrollTo(0, 0);
        setIsEditingPoll(true);
        setOriginalPoll(structuredClone(poll));
        setEditOptionsError("");
        setComment("");
        setDeletePollError("");
    }

    function handleTitle(event) {
        setEditTitleError("");
        let updatedTitle = poll.pollTitle;
        updatedTitle = event.target.value;
        setPoll(prevData => ({
            ...prevData,
            pollTitle: updatedTitle
        }))
    }

    function handleDescription(event) {
        setEditDescriptionError("");
        let updatedDescription = poll.pollDescription;
        updatedDescription = event.target.value;
        setPoll(prevData => ({
            ...prevData,
            pollDescription: updatedDescription
        }))
    }

    function handleCategory(event) {
        let updatedCategory = poll.pollCategory;
        updatedCategory = event.target.value;
        setPoll(prevData => ({
            ...prevData,
            pollCategory: updatedCategory
        }))
    }

    function handleOptionNames(index, value) {
        const pollCopy = structuredClone(poll);
        pollCopy.pollOptions[index].name = value;
        setPoll(pollCopy);
        setOptionsError("");
    }

    function handleOptionImages(index, value) {
        const pollCopy = structuredClone(poll);
        pollCopy.pollOptions[index].imageUrl = value;
        setPoll(pollCopy);
        setOptionsError("");
    }

    function handleAddOption() {
        const pollCopy = structuredClone(poll);
        pollCopy.pollOptions.push(
            {name: "", imageUrl: "", votes: []}
        );
        setPoll(pollCopy);
    }

    function handleCancelEditPoll() {
        setIsEditingPoll(false);
        setPoll(structuredClone(originalPoll));
        setEditOptionsError("");
    }

    function handleUpdatePoll() {
        if (!poll || !user) return;

        setEditOptionsError("");

        const { pollTitle, pollDescription, pollCategory } = poll;

        const updatedOptions = poll.pollOptions.filter((option) => option.name);
        
        const updatedOptionsTrimmed = updatedOptions.map((option) => {
            const newOption = {};
            newOption.name = option.name.trim();
            newOption.imageUrl = option.imageUrl.trim();
            newOption.votes = [...option.votes];
            return newOption;
        })

        if (!pollTitle) {
            setEditTitleError("Please enter a title for your poll.");
            return;
        }
        if (!pollDescription) {
            setEditDescriptionError("Please enter a description for your poll.");
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

                const pollsRef = doc(db, 'polls', poll_id);
                updateDoc(pollsRef, {
                    pollTitle: pollTitle.trim(),
                    pollDescription: pollDescription.trim(),
                    pollCategory,
                    pollOptions: updatedOptionsTrimmed,
                    pollModified: serverTimestamp()
                })
                .then((response) => {
                    setIsPollUpdatedSuccessMessageVisible(true);
                    setTimeout(() => {
                        setIsPollUpdatedSuccessMessageVisible(false);
                    }, 3000);
                    setPoll(prevPoll => ({
                        ...prevPoll,
                        pollTitle: pollTitle.trim(),
                        pollDescription: pollDescription.trim(),
                        pollCategory,
                        pollOptions: updatedOptionsTrimmed
                    }));
                    setIsEditingPoll(false);
                    setEditTitleError("");
                    setEditDescriptionError("");
                    setEditOptionsError("");
                    setUpdatePollError("");
                })
                .catch((error) => {
                    setUpdatePollError("Your poll could not be updated.");
                });
            })
    }

    function handleComment(event) {
        setIsEditingPoll(false);
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

    function handleDeletePoll() {
        setIsEditingPoll(false);
        setIsConfirmDeletePollVisible(true);
    }

    function handleDeletePollNo() {
        setIsConfirmDeletePollVisible(false);
    }

    function handleDeletePollYes() {
        setIsConfirmDeletePollVisible(false);

        const pollRef = doc(db, 'polls', poll_id);
        const commentsQuery = query(
            collection(db, 'comments'),
            where('pollId', '==', poll_id)
        );

        getDocs(commentsQuery)
            .then((commentsSnapshot) => {
                const deleteCommentPromises = commentsSnapshot.docs.map((commentDoc) => {
                    return deleteDoc(commentDoc.ref);
                });
                return Promise.all(deleteCommentPromises);
            })
            .then((response) => {
                return deleteDoc(pollRef);
            })
            .then((response) => {
                setIsPollDeletedSuccessMessageVisible(true);
                setTimeout(() => {
                    setIsPollDeletedSuccessMessageVisible(false);
                }, 3000);
                setDeletePollError("");
                setCategory("");
                navigate('/');
            })
            .catch((error) => {
                setDeletePollError("Your poll could not be deleted.");
            });
    }

    function handlePollCategory(category) {
        setCategory(category);
    }

    function handlePollCardCategory(category) {
        setHomepagePollPage(1);
        setCategory(category);
    }

    function handlePollCardTitle() {
        setCommentsPage(1);
    }

    function handleCommentsPageChange(newPage) {
        if (newPage > 0 && newPage <= totalCommentsPages) {
            setCommentsPage(newPage);
        }
    }

    function handleBreadcrumbCategoryLink() {
        setCategory(poll.pollCategory);
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!poll) {
        return <div className="error">Could not retrieve poll.</div>;
    }

    if (getPollError) {
        return <div className="error">Error: {getPollError}</div>;
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://helpmechoose.uk/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": poll.pollCategory,
                        "item": `https://helpmechoose.uk/poll/${utils.convertToSlug(poll.pollCategory)}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": poll.pollTitle,
                        "item": `https://helpmechoose.uk/poll/${poll_id}`
                    }
                ]
            },
            {
                "@type": "Question",
                "name": poll.pollTitle,
                "text": poll.pollDescription,
                "answerCount": poll.pollOptions.length,
                "suggestedAnswer": poll.pollOptions.map((option) => ({
                    "@type": "Answer",
                    "name": option.name,
                }))
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://helpmechoose.uk/poll/${poll_id}`} />
                <title>{poll.pollTitle} • HelpMeChoose.uk</title>                
                <meta name="description" content={poll.pollDescription} />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div>
                            <Link to="/">Home</Link> &gt; <Link to={`/?category=${utils.convertToSlug(poll.pollCategory)}`} onClick={handleBreadcrumbCategoryLink}
                        >{poll.pollCategory}</Link> &gt; {poll.pollTitle}
                        </div>
                    </div>
                </section>
            </header>

            <main>
                <section id="poll-details">
                    {isEditingPoll
                        ? <>
                            {editTitleError
                                ? <div className="error">{editTitleError}</div>
                                : null
                            }
                
                            <InputTitle
                                title={poll.pollTitle}
                                handleTitle={handleTitle}
                            />
                        </>                        
                        : <h1>{poll.pollTitle}</h1>
                    }

                    {isEditingPoll
                        ? <>
                            {editDescriptionError
                                ? <div className="error">{editDescriptionError}</div>
                                : null
                            }
                            
                            <InputDescription
                                description={poll.pollDescription}
                                handleDescription={handleDescription}
                            />
                        </>
                        : <p id="poll-description" className="copy-output">{poll.pollDescription}</p>
                    }

                    {isEditingPoll
                        ? <div>
                            <InputCategory
                                category={poll.pollCategory}
                                handleCategory={handleCategory}
                            />
                        </div>
                        : <div>
                            <Link
                                to={`/?category=${utils.convertToSlug(poll.pollCategory)}`}
                                onClick={() => handlePollCategory(poll.pollCategory)}
                                className="poll-category"
                            >{poll.pollCategory}</Link>
                        </div>
                    }              
                
                    {isEditingPoll
                        ? null
                        : <>
                            <div>{utils.formatDate(poll.pollCreated)}</div>
                            <div id="poll-owner-image-and-username">
                                <Link to={`/profile/${poll.pollOwnerId}`}>
                                    <div className="poll-owner-image-wrapper">
                                        <img
                                            src={poll.pollOwnerImageUrl}
                                            alt={`Profile image of ${poll.pollOwnerUsername}`}
                                            className="poll-owner-image"
                                        />
                                    </div>
                                </Link>                                     
                                <Link to={`/profile/${poll.pollOwnerId}`} className="poll-owner-username">{poll.pollOwnerUsername}</Link>
                            </div>
                        </>
                    }
                    
                    {editOptionsError
                        ? <div className="error">{editOptionsError}</div>
                        : null
                    }

                    {updateVoteError
                        ? <div className="error">{updateVoteError}</div>
                        : null
                    }

                    {updatePollError
                        ? <div className="error">{updatePollError}</div> 
                        : null
                    }

                    {deletePollError
                        ? <div className="error">{deletePollError}</div>
                        : null
                    }

                    {isConfirmDeletePollVisible
                        ? <div id="delete-poll">
                            <div className="confirm">Delete poll? All votes and comments will also be deleted and can't be recovered.</div>
                            <div className="buttons">
                                <button onClick={handleDeletePollNo}>No</button>
                                <button onClick={handleDeletePollYes}>Yes</button>
                            </div>
                        </div>
                        : null
                    }

                    {isEditingPoll
                        ? <div id="input-options-and-add-option-button">
                            <InputOptions
                                options={poll.pollOptions}
                                handleOptionNames={handleOptionNames}
                                handleOptionImages={handleOptionImages}
                                optionImageUrlError={optionImageUrlError}
                            />
                            {poll.pollOptions.length < 5
                                ? <div>
                                    <button onClick={handleAddOption}>Add Option</button>
                                </div>
                                : null
                            }
                        </div>
                        : <div className="poll-options-wrapper">
                            {poll.pollOptions.map((option, index) => {
                                return (
                                    <div key={index} className="poll-option-wrapper">
                                        <div key={index} className="poll-option-name">{option.name}</div>

                                        <div className="poll-option-votes">{option.votes.length} votes</div>

                                        {option.imageUrl
                                            ? <img src={option.imageUrl} alt={option.name} className="poll-option-image"/>
                                            : null
                                        }
                                        
                                        {!user
                                            ? null
                                            : user.emailVerified && poll.pollOwnerId !== user.uid
                                                ? <div>
                                                    <button
                                                        onClick={() => handleVote(option.name)}
                                                        disabled={userVote === option.name}
                                                    >{userVote === option.name ? 'Voted' : 'Vote'}</button>
                                                </div>
                                                : null
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    }

                    {user &&
                    user.emailVerified &&
                    user.uid === poll.pollOwnerId &&
                    !isEditingPoll &&
                    !isConfirmDeletePollVisible
                        ? <div>
                            <button onClick={handleEditPoll}>Edit</button>
                        </div>
                        : null
                    }

                    {isEditingPoll
                        ? <div className="buttons">
                            <button onClick={handleCancelEditPoll}>Cancel</button>
                            <button onClick={handleUpdatePoll}>Update</button>
                            <button onClick={handleDeletePoll}>Delete</button>
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

                                <div>
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!comment}
                                    >Post Comment</button>
                                </div>
                            </>
                            : null
                    }

                    <>
                        <div className="error">{fetchCommentsError}</div>

                        {comments.length > 0
                            ? <div className="cards-wrapper-and-pagination">
                                <div className="comment-cards-wrapper">
                                    {comments.map((commentObject, index) => {
                                        return (
                                            <CommentCard
                                                key={index}
                                                commentObject={commentObject}
                                                page="poll"
                                                user={user}
                                                updateComment={updateComment}
                                                comment={comment}
                                                setComment={setComment}
                                                isEditingPoll={isEditingPoll}
                                                setIsEditingPoll={setIsEditingPoll}
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
                                <div className="pagination">
                                    <div>
                                        <button onClick={() => handleCommentsPageChange(commentsPage - 1)} disabled={isFetchingComments || commentsPage === 1}>Previous</button>
                                    </div>

                                    <span>Page {commentsPage} of {totalCommentsPages}</span>

                                    <div>
                                        <button onClick={() => handleCommentsPageChange(commentsPage + 1)} disabled={isFetchingComments || commentsPage === totalCommentsPages}>Next</button>
                                    </div>
                                </div>
                            </div>
                            : <div>There are no comments for this poll.</div>
                        }
                    </>
                </section>

                <section>
                    <h2>Latest Polls</h2>

                    <div className="error">{fetchLatestPollsError}</div>

                    {latestPolls.length === 0
                        ? <div>There are no polls to display.</div>
                        : <div className="poll-cards-wrapper">
                            {latestPolls.map((poll, index) => {
                                return (
                                    <PollCard
                                        key={index}
                                        poll={poll}
                                        page="poll"
                                        handlePollCardCategory={handlePollCardCategory}
                                        handlePollCardTitle={handlePollCardTitle}
                                    />
                                )
                            })}
                        </div>
                    }
                </section>

                <section>
                    <h2>Related Polls</h2>

                    <div className="error">{fetchRelatedPollsError}</div>

                    {relatedPolls.length === 0
                        ? <div>There are no related polls.</div>
                        : <div className="poll-cards-wrapper">
                            {relatedPolls.map((poll, index) => {
                                return (
                                    <PollCard
                                        key={index}
                                        poll={poll}
                                        page="poll"
                                        handlePollCardCategory={handlePollCardCategory}
                                        handlePollCardTitle={handlePollCardTitle}
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