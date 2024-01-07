document.addEventListener('DOMContentLoaded', function () {
    const arrayContainer = document.getElementById('array-container');
    const generateArrayButton = document.getElementById('generateArray');
    const startSortButton = document.getElementById('startSort');
    const speedRangeInput = document.getElementById('speedRange');
    const speedLabel = document.getElementById('speedLabel');

    let array = [];

    generateArrayButton.addEventListener('click', generateArray);
    startSortButton.addEventListener('click', startSort);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
                    await swap(array, j, j + 1, speed);
                    await updateArrayBars(arrayBars, arr, speed);
                }
            }
        }
    }

    function swap(arr, index1, index2, speed) {
        return new Promise((resolve) => {
            playTone(arr[index1]);
            playTone(arr[index2]);

            setTimeout(() => {
                const temp = arr[index1];
                arr[index1] = arr[index2];
                arr[index2] = temp;
                resolve();
            }, speed / 8); // Faster swap
        });
    }

    function updateArrayBars(arrayBars, arr, speed) {
        return new Promise((resolve) => {
            setTimeout(() => {
                arrayBars.forEach((bar, index) => {
                    bar.style.height = `${arr[index]}px`;
                });
                resolve();
            }, speed / 8); // Faster update
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

    function playTone(value) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = mapRange(value, 5, 200, 100, 1000); // Map value to frequency
        gainNode.gain.value = 0.3;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.01); // Faster decay
        oscillator.stop(audioContext.currentTime + 0.01); // Faster stop
    }

    function mapRange(value, fromMin, fromMax, toMin, toMax) {
        return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
    }

    // Initial array generation
    generateArray();

    // Update speed label
    speedRangeInput.addEventListener('input', () => {
        const speed = speedRangeInput.value;
        updateSpeedLabel(speed);
    });

    function updateSpeedLabel(speed) {
        const speedLabelValue = getSpeedLabelValue(speed);
        speedLabel.textContent = speedLabelValue;
    }

    function getSpeedLabelValue(speed) {
        if (speed <= 25) {
            return 'Very Fast';
        } else if (speed <= 50) {
            return 'Fast';
        } else if (speed <= 75) {
            return 'Medium';
        } else {
            return 'Slow';
        }
    }
});
