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

    // Get total number of questions to determine pagination
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchQuestionCount = () => {
            const questionsRef = collection(db, "questions");

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