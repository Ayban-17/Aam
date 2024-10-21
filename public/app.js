const searchInput = document.querySelector(".search-input");
const button = document.querySelector("button");

searchInput.addEventListener("keyup", ()=>{
    let searchWords = searchInput.value
    const questionWrapper = document.querySelector(".question-wrapper");
    questionWrapper.innerHTML = `
        <strong>Your Question:</strong> ${searchWords}
    `
})

button.addEventListener('click', async ()=>{
    const searchWord = searchInput.value;

    if(searchWord){
        try {
            const response = await fetch("/inputs", {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({input:searchWord})
            })
            const data = await response.json();
            answeringMachine(data.message);
        } catch (error) {
            console.log("Error: ", error.message)
        }
    }
    
    searchInput.value = "";
})

const answeringMachine = (answer) => {
    const answerWrapper = document.querySelector(".answer-wrapper");
    answerWrapper.innerHTML = `
    <strong>Answer:</strong> ${answer}
    `
}
