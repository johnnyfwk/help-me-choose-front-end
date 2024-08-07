import { useState } from "react";
import { Helmet } from "react-helmet";
import InputTitle from "../components/InputTitle";
import InputDescription from "../components/InputDescription";

export default function PostAQuestion() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    function handlePostQuestion() {
        console.log("Post question button clicked.")
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
                    <input
                        type="button"
                        value="Post Question"
                        onClick={handlePostQuestion}
                    ></input>
                </form>
            </main>
        </>
    )
}