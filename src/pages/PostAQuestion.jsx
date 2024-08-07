import { useState } from "react";
import { Helmet } from "react-helmet";
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";
import InputCategory from "../components/InputCategory";
import InputOptions from "../components/InputOptions";
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function PostAQuestion() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [options, setOptions] = useState(["", "", ""]);
    const [error, setError] = useState("");

    function handlePostQuestion() {
        const filledOptions = options.filter(option => option !== '').map(opt => opt.trim());
        if (filledOptions.length < 2) {
            setError("Please enter at least two options.");
        } else {
            addDoc(collection(db, 'questions'), {
                title: title.trim(),
                description: description.trim(),
                category,
                options: filledOptions,
                votes: Array(filledOptions.length).fill(0)
            })
            .then((response) => {
                console.log(response);
                setTitle("");
                setDescription("");
                setCategory("");
                setOptions(["", "", ""]);
            })
            .catch((error) => {
                console.log(error);
                console.error('Error posting question: ', error);
                setError("Question could not be posted.");
            })
        }

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
                <p>Post a question and get responses from other members.</p>

                <form>
                    <InputTitle
                        title={title}
                        setTitle={setTitle}
                    />

                    <InputDescription
                        description={description}
                        setDescription={setDescription}
                    />

                    <InputCategory
                        category={category}
                        setCategory={setCategory}
                    />

                    <div className="error">{error}</div>

                    <InputOptions
                        options={options}
                        setOptions={setOptions}
                        setError={setError}
                    />

                    <input
                        type="button"
                        value="Post Question"
                        onClick={handlePostQuestion}
                        disabled={!title || !description || !category || options.length < 2}
                    ></input>
                </form>
            </main>
        </>
    )
}