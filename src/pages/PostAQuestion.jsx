import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputOptions from "../components/InputOptions";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PostAQuestion({
    user
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [options, setOptions] = useState(["", "", "", "", ""]);
    const [optionsError, setOptionsError] = useState("");
    const [postQuestionError, setPostQuestionError] = useState("");

    const navigate = useNavigate();

    function handlePostQuestion() {
        const filledOptions = options.filter((option) => option).map((opt) => opt.trim());
        const optionsAndVoters = [];
        filledOptions.map((option) => {
            const optionObject = {};
            optionObject.name = option;
            optionObject.voters = [];
            optionsAndVoters.push(optionObject);
        })

        const titleTrimmed = title.trim();
        const descriptionTrimmed = description.trim();

        if (filledOptions.length < 2) {
            setOptionsError("Please enter at least two options.");
        } else {
            console.log("Question will be posted.")
            addDoc(collection(db, 'questions'), {
                questionOwnerId: user.uid,
                questionOwnerUsername: user.displayName,
                questionTitle: titleTrimmed,
                questionDescription: descriptionTrimmed,
                questionCategory: category,
                questionOptionsAndVoters: optionsAndVoters,
                questionCreated: serverTimestamp(),
                questionModified: ""
            })
            .then((response) => {
                console.log(response);
                setTitle("");
                setDescription("");
                setCategory("");
                setOptions(["", "", "", "", ""]);
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                console.error('Error posting question: ', error);
                setPostQuestionError("Question could not be posted.");
            })
        }
    }

    function handleTitle(event) {
        setTitle(event.target.value);
    }

    function handleDescription(event) {
        setDescription(event.target.value);
    }

    function handleCategory(event) {
        setCategory(event.target.value);
    }

    function handleOptions(index, value) {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        setOptionsError("");
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
                        handleOptions={handleOptions}
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