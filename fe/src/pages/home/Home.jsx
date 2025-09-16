import { Link } from "react-router-dom";
import Quiz from "../../components/quiz/Quiz";

export const sampleQuiz = {
    title: "JavaScript Quiz - 20 Questions",
    questions: [
        {
            text: "What is the output of 1 + '1' in JavaScript?",
            options: ["2", "'11'", "Error", "undefined"],
        },
        {
            text: "Which method converts JSON to a JavaScript object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "None"],
        },
        {
            text: "Which of the following is NOT a JavaScript data type?",
            options: ["Number", "Boolean", "Character", "Undefined"],
        },
        {
            text: "What is the correct syntax to declare a JavaScript variable?",
            options: ["var myVar;", "variable myVar;", "v myVar;", "let myVar;"],
        },
        {
            text: "Which operator is used for strict equality comparison?",
            options: ["==", "===", "=", "!="],
        },
        {
            text: "Which keyword is used to define a constant in JavaScript?",
            options: ["let", "var", "const", "constant"],
        },
        {
            text: "What will `typeof NaN` return?",
            options: ["'number'", "'NaN'", "'undefined'", "'object'"],
        },
        {
            text: "Which array method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
        },
        {
            text: "Which function is used to schedule code to run after a delay?",
            options: ["setTimeout()", "setInterval()", "delay()", "wait()"],
        },
        {
            text: "Which of these is a falsy value in JavaScript?",
            options: ["0", "'0'", "[]", "{}"],
        },
        {
            text: "What does the `this` keyword refer to in a regular function?",
            options: ["The global object", "The function itself", "The parent object", "Depends on how function is called"],
        },
        {
            text: "Which operator is used for exponentiation?",
            options: ["^", "**", "Math.pow()", "%"],
        },
        {
            text: "What is the result of `true + true`?",
            options: ["2", "true", "false", "NaN"],
        },
        {
            text: "Which method creates a new array with all elements that pass a test?",
            options: ["map()", "filter()", "reduce()", "forEach()"],
        },
        {
            text: "Which keyword is used to handle exceptions in JavaScript?",
            options: ["try/catch", "throw/catch", "except", "handle"],
        },
        {
            text: "Which of the following creates a new object in JavaScript?",
            options: ["{}", "new Object()", "Object.create()", "All of the above"],
        },
        {
            text: "What will `console.log(0 == '0')` return?",
            options: ["true", "false", "TypeError", "undefined"],
        },
        {
            text: "Which of these is a proper way to write a JavaScript arrow function?",
            options: ["const sum = (a, b) => a + b;", "function sum(a, b) => a + b;", "sum = (a, b) => {a + b}", "const sum => (a,b) a+b"],
        },
        {
            text: "Which method combines the elements of an array into a string?",
            options: ["join()", "concat()", "push()", "toString()"],
        },
        {
            text: "What does `Array.prototype.reduce()` do?",
            options: [
                "Transforms array to a single value",
                "Adds elements to array",
                "Filters elements",
                "Sorts array",
            ],
        },
    ],
}


function Home() {
    return (
        <div className="">
            {/* <Quiz quiz={sampleQuiz} /> */}
            
        </div>
    );
}

export default Home;
