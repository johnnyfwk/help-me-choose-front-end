import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputOptions from "../components/InputOptions";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as utils from '../../utils';

export default function CreateAPoll({
    user,
    setIsPostPollSuccessMessageVisible
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [options, setOptions] = useState(
        Array(5).fill({ name: "", imageUrl: "", votes: [] })
    );
    const [optionsError, setOptionsError] = useState("");
    const [optionImageUrlError, setOptionImageUrlError] = useState({imageUrls: [], msg: "Image URL is not valid"});
    const [postPollError, setPostPollError] = useState("");

    const navigate = useNavigate();

    function handleTitle(event) {
        setTitle(event.target.value);
    }

    function handleDescription(event) {
        setDescription(event.target.value);
    }

    function handleCategory(event) {
        setCategory(event.target.value);
    }

    function handleOptionNames(index, value) {
        const updatedOptions = options.map((option) => {
            const optionCopy = {};
            optionCopy.name = option.name;
            optionCopy.imageUrl = option.imageUrl;
            optionCopy.votes = [];
            return optionCopy;
        })
        updatedOptions[index].name = value;
        setOptions(updatedOptions);
        setOptionsError("");
    }

    function handleOptionImages(index, value) {
        const updatedOptions = options.map((option) => {
            const optionCopy = {};
            optionCopy.name = option.name;
            optionCopy.imageUrl = option.imageUrl;
            optionCopy.votes = [];
            return optionCopy;
        })
        updatedOptions[index].imageUrl = value;
        setOptions(updatedOptions);
        setOptionsError("");
    }

    function handlePostPoll() {
        const filteredOptions = options.filter((option) => option.name);

        const newOptions = filteredOptions.map((option) => {
            const trimmedOption = {};
            trimmedOption.name = option.name.trim();
            trimmedOption.imageUrl = option.imageUrl.trim();
            trimmedOption.votes = [...option.votes];
            return trimmedOption;
        });

        const invalidImageUrls = [];

        const validateImageUrls = newOptions.map((option) => {
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
                if (newOptions.length < 2) {
                    setOptionsError("Please enter at least two options.");
                    return;
                }
                
                if (invalidImageUrls.length > 0) {
                    setOptionImageUrlError({
                        imageUrls: invalidImageUrls,
                        msg: "Image URL is not valid."
                    });
                    return;
                }

                addDoc(collection(db, 'polls'), {
                    pollOwnerId: user.uid,
                    pollOwnerUsername: user.displayName,
                    pollOwnerImageUrl: user.photoURL,
                    pollTitle: title.trim(),
                    pollDescription: description.trim(),
                    pollCategory: category,
                    pollOptions: newOptions,
                    pollCreated: serverTimestamp(),
                    pollModified: serverTimestamp(),
                })
                .then(() => {
                    setIsPostPollSuccessMessageVisible(true);
                    setTimeout(() => {
                        setIsPostPollSuccessMessageVisible(false);
                    }, 3000);
                    setTitle("");
                    setDescription("");
                    setCategory("");
                    setOptions(Array(5).fill({ name: "", imageUrl: "", votes: [] }));
                    navigate('/');
                })
                .catch((error) => {
                    setPostPollError("Your poll could not be posted.");
                });
            })
    }

    const schemaData = {
        "@context": "https://schema.org",
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
                "name": "Create a Poll",
                "item": "https://helpmechoose.uk/create-a-poll"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/create-a-poll" />
                <title>Create a Poll • HelpMeChoose.uk</title>                
                <meta name="description" content="Create a poll and get help making a choice." />
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <header>
                <section>
                    <div aria-label="breadcrumb" className="nav-breadcrumbs">
                        <div><Link to="/">Home</Link> &gt; Create a Poll</div>
                    </div>
                </section>
            </header>

            <main>
                <section>
                    <h1>Create a Poll</h1>
                    <p>If you need help making a choice, create a poll and let other members vote on your options and offer suggestions and advice.</p>

                    <div className="error">{postPollError}</div>

                    <form>
                        <InputTitle
                            title={title}
                            handleTitle={handleTitle}
                        />

                        <InputDescription
                            description={description}
                            handleDescription={handleDescription}
                        />

                        <InputCategory
                            category={category}
                            handleCategory={handleCategory}
                            page={"create a poll"}
                        />

                        <div className="error">{optionsError}</div>

                        <InputOptions
                            options={options}
                            handleOptionNames={handleOptionNames}
                            handleOptionImages={handleOptionImages}
                            optionImageUrlError={optionImageUrlError}
                        />
                        
                        <input
                            type="button"
                            value="Create Poll"
                            onClick={handlePostPoll}
                            disabled={!title || !description || !category}
                        ></input>
                    </form>
                </section>
            </main>
        </>
    )
}