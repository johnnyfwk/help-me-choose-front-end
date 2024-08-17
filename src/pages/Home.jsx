import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { collection, getDocs, getCountFromServer, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import QuestionCard from '../components/QuestionCard';
import InputCategory from '../components/InputCategory';
import * as utils from '../../utils';

export default function Home({category, setCategory}) {
    const [ searchParams ] = useSearchParams();
    const category_slug = searchParams.get("category");

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    
    const [page, setPage] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [fetchQuestionsMessage, setFetchQuestionsMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const questionsPerPage = 30;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

    useEffect(() => {
        const questionsRef = collection(db, "questions");

        if (!category_slug) {
            getCountFromServer(questionsRef)
                .then((allQuestionsSnapshot) => {
                    const totalQuestions = allQuestionsSnapshot.data().count;
                    setTotalQuestions(totalQuestions);
                })
                .catch((error) => {
                    console.error("Error fetching document counts: ", error);
                })
        } else {
            const categoryQuery = query(questionsRef, where("questionCategory", "==", utils.convertSlugToCategory(category_slug)));
            getCountFromServer(categoryQuery)
                .then((categoryQuestionsSnapshot) => {
                    const totalCategoryQuestions = categoryQuestionsSnapshot.data().count;
                    setTotalQuestions(totalCategoryQuestions);
                })
                .catch((error) => {
                    console.error("Error fetching document counts: ", error);
                })
        }
    }, [category_slug]);

    useEffect(() => {
        setIsFetching(true);
        const questionsRef = collection(db, 'questions');

        let q;

        if (page === 1) {
            q = query(
                questionsRef,
                ...(category_slug ? [where("questionCategory", "==", utils.convertSlugToCategory(category_slug))] : []),
                orderBy('questionModified', 'desc'),
                limit(questionsPerPage)
            );
        } else {
            const offset = (page - 1) * questionsPerPage;

            const tempQuery = query(
                questionsRef,
                ...(category_slug ? [where("questionCategory", "==", utils.convertSlugToCategory(category_slug))] : []),
                orderBy('questionModified', 'desc'),
                limit(offset)
            );

            getDocs(tempQuery)
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

                        q = query(
                            questionsRef,
                            ...(category_slug ? [where("questionCategory", "==", utils.convertSlugToCategory(category_slug))] : []),
                            orderBy('questionModified', 'desc'),
                            startAfter(lastVisible),
                            limit(questionsPerPage)
                        );

                        return getDocs(q);
                    }
                })
                .then((snapshot) => {
                    if (snapshot) {
                        const documents = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        setQuestions(documents);
                    }
                    setIsFetching(false);
                })
                .catch((error) => {
                    console.error("Error fetching documents: ", error);
                    setIsFetching(false);
                    setFetchQuestionsMessage("Could not fetch questions.");
                });

            return;
        }

        getDocs(q)
            .then((snapshot) => {
                const documents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setQuestions(documents);
                setIsFetching(false);
            })
            .catch((error) => {
                console.error("Error fetching documents: ", error);
                setIsFetching(false);
                setFetchQuestionsMessage("Could not fetch questions.");
            });
    }, [page, category_slug]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    function handleCategory(event) {
        setCategory(event.target.value);
        if (event.target.value === "") {
            navigate("/");
        } else {
            navigate(`/?category=${utils.convertToSlug(event.target.value)}`);
        }
    }

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

                <InputCategory
                    category={category}
                    handleCategory={handleCategory}
                    page={"home"}
                />

                <div>{fetchQuestionsMessage}</div>

                {questions.length > 0
                    ? <>
                        <div className="question-cards-wrapper">
                            {questions.map((question, index) => {
                                return <QuestionCard key={index} question={question} page="home" />
                            })}
                        </div>
                        <div>
                            <button onClick={() => handlePageChange(page - 1)} disabled={isFetching || page === 1}>Previous</button>
                            <span> Page {page} of {totalPages} </span>
                            <button onClick={() => handlePageChange(page + 1)} disabled={isFetching || page === totalPages}>Next</button>
                        </div>
                    </>
                    : <div>There are no questions in this category.</div>
                }
            </main>
        </>
    )
}