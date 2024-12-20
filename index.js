document.addEventListener("DOMContentLoaded", () => {

    // declarations

    const progressBar = document.querySelector(".progress-bar");
    const progress = document.querySelector(".progress");
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("previous-btn");
    const tabs = document.querySelectorAll(".nav-tabs .nav-link");
    const tabContents = document.querySelectorAll(".tab-pane");
    const totalTabs = tabs.length;
    let currentIndex = 0;

    // function for updating the progress bar
    const updateProgressBar = () => {
        const progressPercentage = Math.round((currentIndex / (totalTabs - 1)) * 100);
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${progressPercentage}%`;
        progress.setAttribute("aria-valuenow", progressPercentage);
    };

    // function for updating tab navigation (helped with AI)
    const updateTabNavigation = () => {
        // Ensure currentIndex stays within bounds
        if (currentIndex < 0 || currentIndex >= totalTabs) {
            return;
        }

        // this should enable the current tab and deactivate the rest

        tabs.forEach((tab, index) => {
            tab.classList.toggle("active", index === currentIndex);
            tab.ariaSelected = index === currentIndex;
            tab.disabled = index !== currentIndex;
        });

        // show the tab info only in the current tab
        tabContents.forEach((content, index) => {
            content.classList.toggle("show", index === currentIndex);
            content.classList.toggle("active", index === currentIndex);
        });

        // hide the previous button IF on step 1
        prevButton.style.display = currentIndex === 0 ? "none" : "inline-block";

        // if question = last question, then next button gets replaced
        // with the button to show the results in a doughnut
        nextButton.textContent = currentIndex === totalTabs - 1 ? "Show results" : "Next";
    };

    // function to validate the current step
    const validateCurrentStep = () => {
        const currentForm = tabContents[currentIndex].querySelector("form");
        if (!currentForm) return true; // No form, no validation needed

        const answered = currentForm.querySelector("input[type='radio']:checked");
        return !!answered; // Return true if any radio button is checked
    };

    // function to count all the answers (correct and incorrect)
    const countAnswers = () => {
        let correct = 0;
        let incorrect = 0;
        const answers = document.querySelectorAll("input[type='radio']:checked");

        answers.forEach((answer) => {
            if (answer.value === "true") correct++;
            else incorrect++;
        });

        return { correct, incorrect };
    };

    // buttons
    nextButton.addEventListener("click", () => {
        if (!validateCurrentStep()) {
            alert("Please answer the question before proceeding.");
            return;
        }

        // if question = not the last one, then proceed
        if (currentIndex < totalTabs - 1) {
            currentIndex++;
            updateProgressBar();
            updateTabNavigation();
        } else {
            const { correct, incorrect } = countAnswers();
            alert(`Quiz completed! Correct answers: ${correct}, Incorrect answers: ${incorrect}`);
            showChart(
                correct,
                incorrect)
        }
    });

    // function for calling the chart (potential optimization)
    let activeChart = null;

    const showChart = (correct, incorrect) => {

        const chart = document.querySelector('#my-chart')

        // function to destroy the old doufhnut if user were to redo the quiz (helped with AI)
        // (click show results button)
        if (activeChart) {
            activeChart.destroy();
        }

        activeChart = new Chart(chart, {
            type: 'doughnut',
            data: {
                labels: ['Correct Answers', 'Incorrect Answers'],
                datasets: [{
                    label: 'Results',
                    data: [correct, incorrect],
                    borderWidth: 1
                }]
            },
        });

    }


    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateProgressBar();
            updateTabNavigation();
        }
    });

    // function to initialize the quiz (optimizations)
    const initializeQuiz = () => {
        updateProgressBar();
        updateTabNavigation();
    };

    initializeQuiz();
});
