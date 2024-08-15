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
    user
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
        console.log("newOptions", newOptions);

        const invalidImageUrls = [];

        const validateImageUrls = newOptions.map((option) => {
            if (option.imageUrl) {
                return utils.validateImageUrl(option.imageUrl)
                    .then((response) => {
                        console.log("Response", response);
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
        console.log("validateImageUrls", validateImageUrls)

        Promise.all(validateImageUrls)
            .then((response) => {
                console.log(response);
                if (invalidImageUrls.length > 0) {
                    setOptionImageUrlError({
                        imageUrls: invalidImageUrls,
                        msg: "Image URL is not valid."
                    });
                    return;
                }

                if (newOptions.length < 2) {
                    setOptionsError("Please enter at least two options.");
                    console.log("Options won't be stored.");
                    return;
                }

                console.log("questionOwnerId:", user.uid);
                console.log("questionOwnerUsername:", user.displayName)
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
                console.log(":", )
            })

        // Check if Image URL is valid
        // const newOptionImageUrlError = {
        //     imageUrls: [],
        //     msg: "Image URL is not valid"
        // };        

        // const allOptionImageUrls = [];
        
        // newOptions.forEach((option) => {
        //     const trimmedOptionImageUrl = option.imageUrl.trim();
        //     utils.validateImageUrl(trimmedOptionImageUrl)
        //         .then((response) => {
        //             console.log("response", response);
        //             if (!response) {
        //                 newOptionImageUrlError.imageUrls.push(trimmedOptionImageUrl);
        //                 setOptionImageUrlError(newOptionImageUrlError);
        //             }
        //             allOptionImageUrls.push(response);
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //             allOptionImageUrls.push(false);
        //         })
        // });
        // console.log("allOptionImageUrls", allOptionImageUrls);

        // newOptions.forEach((option) => {            
        //     const trimmedOptionImageUrl = option.imageUrl.trim();
        //     if (trimmedOptionImageUrl) {
        //         utils.validateImageUrl(trimmedOptionImageUrl)
        //             .then((response) => {
        //                 if (!response) {
        //                     newOptionImageUrlError.imageUrls.push(trimmedOptionImageUrl);
        //                     setOptionImageUrlError(newOptionImageUrlError);
        //                     return;
        //                 }
        //             })
        //             .catch((error) => {
        //                 console.log(error);
        //                 return;
        //             })
        //     } else {
        //         console.log("No image URL to test");
        //     }
        // })
        // Check if Image URL is valid


        if (newOptions.length < 2) {
            setOptionsError("Please enter at least two options.");
            console.log("Options won't be stored.")
        } else {
            console.log("Options will be stored.")
        }
        // else {
        //     addDoc(collection(db, 'questions'), {
        //         questionOwnerId: user.uid,
        //         questionOwnerUsername: user.displayName,
        //         questionTitle: titleTrimmed,
        //         questionDescription: descriptionTrimmed,
        //         questionCategory: category,
        //         questionOptionsAndVoters: optionsAndVoters,
        //         questionCreated: serverTimestamp(),
        //         questionModified: ""
        //     })
        //     .then((response) => {
        //         setTitle("");
        //         setDescription("");
        //         setCategory("");
        //         setOptions(["", "", "", "", ""]);
        //         navigate('/');
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         console.error('Error posting question: ', error);
        //         setPostQuestionError("Question could not be posted.");
        //     })
        // }
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