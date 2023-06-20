const container = document.querySelector('.container');
const input = container.querySelector('input[type="file"]');

let nElems = 0;

input.onchange = (e) => {

    // read directory
    const videoFiles = Array.from(e.target.files).filter((file) => {
        // check if file is video
        return file.type.includes('video');
    });

    // convert file to video
    const videoElems = videoFiles.map((videoFile) => {
        const videoElem = document.createElement('video');
        const reader = new FileReader();
        reader.onload = (e) => {
            videoElem.src = e.target.result;

        };
        reader.readAsDataURL(videoFile);
        return videoElem;
    });

    // append video to body
    videoElems.forEach((video) => {
        addVideo(video);
    })
}

window.onkeydown = (e) => {
    if (e.key === 'Escape') {
        const elems = container.querySelectorAll('.container__cell--active');
        elems.forEach((elem) => {
            close(elem);
        })
        e.preventDefault();
    }
}


function close(elem) {
    const video = elem.querySelector('video');
    elem.classList.remove('container__cell--active')

    video.controls = false;
    video.currentTime = 0;

    video.pause();
}

function open(elem) {
    const video = elem.querySelector('video');
    elem.classList.add('container__cell--active')

    video.controls = true;
    video.currentTime = 0;

    video.play();
}

function addVideo(videoElem) {
    const elem = document.createElement('div');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('container__cell-close');
    elem.classList.add('container__cell');
    elem.appendChild(videoElem);
    elem.appendChild(closeBtn);
    container.appendChild(elem);

    closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        close(elem)
    }

    elem.onclick = (e) => {
        if (e.target.classList.contains('container__cell--active')) return;

        e.preventDefault();

        const elems = container.querySelectorAll('.container__cell');
        elems.forEach((currElem) => {
            (currElem === elem) ? open(currElem) : close(currElem)
        })
    }

    nElems++;
    container.dataset.filled = nElems

    // get best grid layout based on number of elements
    const grid = getGridLayout(nElems);
    container.style.gridTemplateColumns = grid;


    // remove video control s
    // playsinline for iOS
    videoElem.controls = false;
    videoElem.disablePictureInPicture = true;
    videoElem.controlsList = "noplaybackrate nodownload nofullscreen"

    videoElem.setAttribute('playsinline', '');
}

function getGridLayout(nElems) {
    const nCols = Math.ceil(Math.sqrt(nElems));
    const grid = `repeat(${nCols}, 1fr)`;
    return grid;
}