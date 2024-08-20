import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { collection, getDocs, getCountFromServer, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import QuestionCard from '../components/QuestionCard';
import InputCategory from '../components/InputCategory';
import * as utils from '../../utils';

export default function Home({category, setCategory, homepageQuestionPage, setHomepageQuestionPage}) {
    const [ searchParams ] = useSearchParams();
    const category_slug = searchParams.get("category");

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    
    const questionsPerPage = 20;    
    const [isFetching, setIsFetching] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);    
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const [fetchQuestionsError, setFetchQuestionsError] = useState("");

    const titleAndH1 = "Get Help Making a Choice";

    
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchQuestionCount = () => {
            const questionsRef = collection(db, 'questions');

            if (!category_slug) {
                utils.getDocumentCount(getCountFromServer, questionsRef, setTotalQuestions);
            } else {
                const categoryQuery = query(
                    questionsRef,
                    where("questionCategory", "==", utils.convertSlugToCategory(category_slug))
                );
                utils.getDocumentCount(getCountFromServer, categoryQuery, setTotalQuestions);
            }
        };        

        fetchQuestionCount();
    }, [category_slug]);

    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetching,
            collection,
            db,
            'questions',
            homepageQuestionPage,
            query,
            category_slug,
            utils.convertSlugToCategory(category_slug),
            where,
            "questionCategory",
            orderBy,
            'questionModified',
            limit,
            questionsPerPage,
            getDocs,
            startAfter,
            setQuestions,
            setFetchQuestionsError,
        );
    }, [category_slug, homepageQuestionPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setHomepageQuestionPage(newPage);
        }
    };

    function handleCategory(event) {
        setHomepageQuestionPage(1);
        setCategory(event.target.value);
        if (event.target.value === "") {
            navigate("/");
        } else {
            navigate(`/?category=${utils.convertToSlug(event.target.value)}`);
        }
    }

    function handleQuestionCardCategory(category) {
        setHomepageQuestionPage(1);
        setCategory(category);
    }

    return (
        <>
            {!category_slug
                ? <Helmet>
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://helpmechoose.uk/" />
                    <title>{titleAndH1} • HelpMeChoose.uk</title>                
                    <meta name="description" content="Get help making a choice by creating a poll and letting other members vote on your options and offer suggestions and advice." />
                </Helmet>
                : <Helmet>
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href={`https://helpmechoose.uk/?category=${category_slug}`} />
                    <title>{utils.convertSlugToCategory(category_slug)} • HelpMeChoose.uk</title>                
                    <meta name="description" content={`Help others make a choice related to ${utils.convertSlugToCategory(category_slug)}.`} />
                </Helmet>
            }
            
            <main>
                {!category_slug
                    ? <>
                        <h1>{titleAndH1}</h1>
                        <p>Can't decide between pizza, curry, or tacos for dinner tonight? Not sure whether to get the latest Google Pixel or iPhone? Are you torn between visiting the Taj Mahal in India or the Colosseum in Italy?</p>
                        <p></p>
                    </>
                    : <h1>{utils.convertSlugToCategory(category_slug)}</h1>
                }

                <InputCategory
                    category={category}
                    handleCategory={handleCategory}
                    page={"home"}
                />

                <div>{fetchQuestionsError}</div>

                {questions.length > 0
                    ? <>
                        <div className="question-cards-wrapper">
                            {questions.map((question, index) => {
                                return (
                                    <QuestionCard
                                        key={index}
                                        question={question}
                                        page="home"
                                        handleQuestionCardCategory={handleQuestionCardCategory}
                                    />
                                )
                            })}
                        </div>
                        <div>
                            <button onClick={() => handlePageChange(homepageQuestionPage - 1)} disabled={isFetching || homepageQuestionPage === 1}>Previous</button>
                            <span>Page {homepageQuestionPage} of {totalPages}</span>
                            <button onClick={() => handlePageChange(homepageQuestionPage + 1)} disabled={isFetching || homepageQuestionPage === totalPages}>Next</button>
                        </div>
                    </>
                    : <div>There are no questions in this category.</div>
                }
            </main>
        </>
    )
}