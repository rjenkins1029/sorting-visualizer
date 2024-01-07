document.addEventListener('DOMContentLoaded', function () {
    const arrayContainer = document.getElementById('array-container');
    const generateArrayButton = document.getElementById('generateArray');
    const startSortButton = document.getElementById('startSort');
    const speedRangeInput = document.getElementById('speedRange');

    let array = [];

    generateArrayButton.addEventListener('click', generateArray);
    startSortButton.addEventListener('click', startSort);

    function generateArray() {
        array = [];
        arrayContainer.innerHTML = '';

        for (let i = 0; i < 30; i++) {
            const value = getRandomInt(5, 200);
            array.push(value);

            const arrayBar = document.createElement('div');
            arrayBar.classList.add('array-bar');
            arrayBar.style.height = `${value}px`;
            arrayContainer.appendChild(arrayBar);
        }
    }

    function startSort() {
        disableButtons();
        const speed = speedRangeInput.value;

        bubbleSort(array, speed).then(() => {
            enableButtons();
        });
    }

    async function bubbleSort(arr, speed) {
        const arrayBars = document.querySelectorAll('.array-bar');

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    await swap(array, j, j + 1);
                    await updateArrayBars(arrayBars, arr, speed);
                }
            }
        }
    }

    function swap(arr, index1, index2) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const temp = arr[index1];
                arr[index1] = arr[index2];
                arr[index2] = temp;
                resolve();
            }, 200);
        });
    }

    function updateArrayBars(arrayBars, arr, speed) {
        return new Promise((resolve) => {
            setTimeout(() => {
                arrayBars.forEach((bar, index) => {
                    bar.style.height = `${arr[index]}px`;
                });
                resolve();
            }, speed);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function disableButtons() {
        generateArrayButton.disabled = true;
        startSortButton.disabled = true;
        speedRangeInput.disabled = true;
    }

    function enableButtons() {
        generateArrayButton.disabled = false;
        startSortButton.disabled = false;
        speedRangeInput.disabled = false;
    }

    // Initial array generation
    generateArray();
});
