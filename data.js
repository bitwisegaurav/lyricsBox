const lyricsBox = document.getElementById('lyrics');
const playButton = document.getElementById('playButton');
const song = document.getElementById('song');
const para = document.getElementById('para');
const outerBox = document.getElementById('outerBox');
let isPlaying = false;
let lines;
const lyrics = [];
const songName = "Perfect";
let currentIndex = 0;
let motion = 0;
let time = 0;

fetch(`${songName}.lrc`)
.then(response => response.text())
.then(data => {
    const regex = /\[(\d{2}):(\d{2}\.\d{2})\](.*)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
        const minute = parseInt(match[1]);
        const second = parseFloat(match[2]);
        const text = match[3];
        lyrics.push({ minute, second, text });
    }
    setData();
    // moveLyricsUp();
})
.catch(error => {
    console.error('Error fetching data:', error);
});

function setData() {
    song.src = `${songName}.mp3`;
    lyrics.forEach(element => {
        const currentLine = element;
        const currtime = currentLine.minute * 60 + currentLine.second;
        lyricsBox.innerHTML += `<line data-time="${currtime}">${currentLine.text}</line>`;
    });
    lines = document.querySelectorAll('line');
    // moveLyricsUp();
}

playButton.addEventListener('click', () => {
    // moveLyricsUp();
    if (!isPlaying) {
        song.play();
        isPlaying = true;
        playButton.textContent = 'Pause';
        displayLyricsWithTime(); 
    } else {
        song.pause();
        isPlaying = false;
        // currentIndex = 0;
        // lines.forEach(element => {
        //     element.classList.remove('visited');
        // });
        playButton.textContent = 'Play';
    }
});

function displayLyricsWithTime() {
    let minute, seconds;
    if (isPlaying && time < song.duration) {
        time += 0.01;
        minute = Math.floor(time / 60);
        seconds = (time % 60).toFixed(2);
        para.textContent = `${minute}:${seconds}`;

        if (currentIndex < lyrics.length) {
            const currentLine = lines[currentIndex];
            const currentTime = parseFloat(currentLine.getAttribute('data-time'));
            if (currentTime.toFixed(2) === time.toFixed(2)) {
                currentLine.classList.add('visited');
                currentIndex++;
                moveLyricsUp();
            }
        }
        setTimeout(displayLyricsWithTime, 10); 
    } 
}

function moveLyricsUp() {
    const currentLine = lines[currentIndex];
    const lastLine = lines[lines.length - 1];
    const last = lastLine.getBoundingClientRect();
    const currLine = currentLine.getBoundingClientRect();
    const lineHeight = currLine.height;
    const outerBoxprops = outerBox.getBoundingClientRect();
    const offsetHeight = outerBoxprops.height;
    const distanceFromTop = currLine.top - outerBoxprops.top;

    if ((distanceFromTop - lineHeight ) > offsetHeight / 2 && last.bottom > outerBoxprops.bottom) {
        motion += lineHeight;
    }
    lyricsBox.style.transform = `translateY(-${motion}px)`;
}