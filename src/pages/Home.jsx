import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { collection, getDocs, getCountFromServer, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import PollCard from '../components/PollCard';
import InputCategory from '../components/InputCategory';
import * as utils from '../../utils';

export default function Home({user, category, setCategory, homepagePollPage, setHomepagePollPage}) {
    const [ searchParams ] = useSearchParams();
    const category_slug = searchParams.get("category");

    const navigate = useNavigate();

    const [polls, setPolls] = useState([]);
    
    const pollsPerPage = 20;    
    const [isFetching, setIsFetching] = useState(false);
    const [totalPolls, setTotalPolls] = useState(0);    
    const totalPages = Math.ceil(totalPolls / pollsPerPage);
    const [fetchPollsError, setFetchPollsError] = useState("");

    const titleAndH1 = "Get help making choices from the community";

console.log(category)
    
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchPollCount = () => {
            const pollsRef = collection(db, 'polls');

            if (!category_slug) {
                utils.getDocumentCount(getCountFromServer, pollsRef, setTotalPolls);
            } else {
                const categoryQuery = query(
                    pollsRef,
                    where("pollCategory", "==", utils.convertSlugToCategory(category_slug))
                );
                utils.getDocumentCount(getCountFromServer, categoryQuery, setTotalPolls);
            }
        };        

        fetchPollCount();
    }, [category_slug]);

    useEffect(() => {
        utils.fetchPaginatedDocuments(
            setIsFetching,
            collection,
            db,
            'polls',
            homepagePollPage,
            query,
            category_slug,
            utils.convertSlugToCategory(category_slug),
            where,
            "pollCategory",
            orderBy,
            'pollModified',
            limit,
            pollsPerPage,
            getDocs,
            startAfter,
            setPolls,
            setFetchPollsError,
        );
    }, [category_slug, homepagePollPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setHomepagePollPage(newPage);
        }
        window.scrollTo(0, 0);
    };

    function handleCategory(event) {
        setHomepagePollPage(1);
        setCategory(event.target.value);
        if (event.target.value === "") {
            navigate("/");
        } else {
            navigate(`/?category=${utils.convertToSlug(event.target.value)}`);
        }
    }

    function handlePollCardCategory(category) {
        setHomepagePollPage(1);
        setCategory(category);
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Home",
        "url": "https://helpmechoose.uk/",
        "about": {
            "@type": "Organization",
            "name": "HelpMeChoose.uk",
            "url": "https://helpmechoose.uk/"
        }
    }

    return (
        <>
            {!category_slug
                ? <Helmet>
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://helpmechoose.uk/" />
                    <title>{titleAndH1} • HelpMeChoose.uk</title>                
                    <meta name="description" content="Get help making a choice by creating a poll and getting suggestions and advice from the community." />
                    <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
                </Helmet>
                : <Helmet>
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href={`https://helpmechoose.uk/?category=${category_slug}`} />
                    <title>{utils.convertSlugToCategory(category_slug)} • HelpMeChoose.uk</title>                
                    <meta name="description" content={`Help others make a choice related to ${utils.convertSlugToCategory(category_slug)}.`} />
                    <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
                </Helmet>
            }
            
            <main>
                <section>
                    <div className="copy">
                        <h1>{titleAndH1}</h1>

                        {!user || !user.emailVerified
                            ? <p>Get help making a choice by creating a poll and getting suggestions and advice from the community.</p>
                            : <p>Get help making a choice by <Link to="/create-a-poll">creating a poll</Link> and getting suggestions and advice from the community.</p>
                        }

                        {category_slug
                            ? <h2>{utils.convertSlugToCategory(category_slug)}</h2>
                            : null
                        }
                    </div>
                    

                    {fetchPollsError
                        ? <div className="error">{fetchPollsError}</div>
                        : null
                    }
                    
                    <form>
                        <InputCategory
                            category={category}
                            handleCategory={handleCategory}
                            page={"home"}
                        />
                    </form>
                    
                    {polls.length > 0
                        ? <div className="cards-wrapper-and-pagination">
                            <div className="poll-cards-wrapper">
                                {polls.map((poll, index) => {
                                    return (
                                        <PollCard
                                            key={index}
                                            poll={poll}
                                            page="home"
                                            handlePollCardCategory={handlePollCardCategory}
                                        />
                                    )
                                })}
                            </div>
                            <div className="pagination">
                                <div>
                                    <button onClick={() => handlePageChange(homepagePollPage - 1)} disabled={isFetching || homepagePollPage === 1}>Previous</button>
                                </div>

                                <span>Page {homepagePollPage} of {totalPages}</span>

                                <div>
                                    <button onClick={() => handlePageChange(homepagePollPage + 1)} disabled={isFetching || homepagePollPage === totalPages}>Next</button>
                                </div>
                            </div>
                        </div>
                        : <div>There are no polls to display in this category.</div>
                    }
                </section>
            </main>
        </>
    )
}