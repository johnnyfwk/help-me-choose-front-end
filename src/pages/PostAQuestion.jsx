import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputOptions from "../components/InputOptions";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as utils from '../../utils';

export default function PostAQuestion({
    user,
    setIsPostQuestionSuccessMessageVisible
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [options, setOptions] = useState(
        Array(5).fill({ name: "", imageUrl: "", votes: [] })
    );
    const [optionsError, setOptionsError] = useState("");
    const [optionImageUrlError, setOptionImageUrlError] = useState({imageUrls: [], msg: "Image URL is not valid"});
    const [postQuestionError, setPostQuestionError] = useState("");

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

    function handlePostQuestion() {
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

                addDoc(collection(db, 'questions'), {
                    questionOwnerId: user.uid,
                    questionOwnerUsername: user.displayName,
                    questionOwnerImageUrl: user.photoURL,
                    questionTitle: title.trim(),
                    questionDescription: description.trim(),
                    questionCategory: category,
                    questionOptions: newOptions,
                    questionCreated: serverTimestamp(),
                    questionModified: serverTimestamp(),
                })
                .then(() => {
                    setIsPostQuestionSuccessMessageVisible(true);
                    setTimeout(() => {
                        setIsPostQuestionSuccessMessageVisible(false);
                    }, 3000);
                    setTitle("");
                    setDescription("");
                    setCategory("");
                    setOptions(Array(5).fill({ name: "", imageUrl: "", votes: [] }));
                    navigate('/');
                })
                .catch((error) => {
                    setPostQuestionError("Your question could not be posted.");
                });
            })
    }

    return (
        <>
            <Helmet>
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://helpmechoose.uk/post-a-question" />
                <title>Post a Question • HelpMeChoose.uk</title>                
                <meta name="description" content="Post a question and get responses from other members on HelpMeChoose.uk." />
            </Helmet>

            <main>
                <h1>Post a Question</h1>
                <p>Post a question and let other members vote on your options.</p>

                <div className="error">{postQuestionError}</div>

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
                        page={"post a question"}
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
                        value="Post Question"
                        onClick={handlePostQuestion}
                        disabled={!title || !description || !category}
                    ></input>
                </form>
            </main>
        </>
    )
}