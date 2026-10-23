const factButton = document.getElementById("factButton");

const factText = document.getElementById("factText");

const loading = document.getElementById("loading");

const error = document.getElementById("error");


factButton.addEventListener("click", async () => {

    factButton.disabled = true;

    loading.classList.remove("hidden");

    error.classList.add("hidden");

    factText.textContent = "Thinking...";


    try {

        const response = await fetch("/fun-fact");


        if (!response.ok) {
            throw new Error("Failed to get fun fact");
        }


        const data = await response.json();


        factText.textContent = data.fact;


    } catch (err) {

        console.log(err);

        factText.textContent = "";

        error.textContent =
            "Unable to get a fun fact. Please try again.";

        error.classList.remove("hidden");


    } finally {

        loading.classList.add("hidden");

        factButton.disabled = false;

    }

});