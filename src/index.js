import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getImage from "./webApi.js";

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
        if (data.totalHits === 0) {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        // galleryMarkUp(data.hits);
    }

    catch (error) {
        console.log(error);
    }
};

function galleryMarkUp(serverArray) {
    return serverArray
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
            return serverArray
            `                 
        <div class="photo-card">
        <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
            <b>Likes${likes}</b>
            </p>
            <p class="info-item">
            <b>Views${views}</b>
            </p>
            <p class="info-item">
            <b>Comments${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads${downloads}</b>
            </p>
        </div>
        </div>
        `
        });
};

function clearGallery() {
    gallery.innerHTML = "";
};
