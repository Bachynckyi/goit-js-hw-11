import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getImage from "./webApi.js";
import "simplelightbox/dist/simple-lightbox.min.css";

const inputArea = document.querySelector(".search-input");
const submitButton = document.querySelector(".submit-button");
const gallery = document.querySelector(".gallery");
const loadButton = document.querySelector(".load-more");

submitButton.addEventListener('click', onSearch);


async function onSearch(event) {
    event.preventDefault();
    let searchQuery = inputArea.value.trim();
    try {
        const data = await getImage(searchQuery);
        console.log(data);
        if (data.totalHits === 0 || searchQuery === "") {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        gallery.innerHTML = galleryMarkUp(data.hits);
        lightBox();
    }
    catch (error) {
        console.log(error);
    }
};

function galleryMarkUp(serverArray) {
    return serverArray
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `                 
        <div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
            <b>Likes</b>${likes}
            </p>
            <p class="info-item">
            <b>Views</b>${views}
            </p>
            <p class="info-item">
            <b>Comments</b>${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>${downloads}
            </p>
        </div>
        </div>
        `})
        .join('');
};

function clearGallery() {
    gallery.innerHTML = "";
};


function lightBox() {
    let lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: "alt",
        captionsPosition: "bottom",
        captionsDelay: 250,
        showCounter: false,
        enableKeyboard: true,
    });
};