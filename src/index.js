import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import serviceAPI from './serviceAPI.js'
import "simplelightbox/dist/simple-lightbox.min.css";

const inputArea = document.querySelector(".search-input");
const submitButton = document.querySelector(".submit-button");
const gallery = document.querySelector(".gallery");
const loadButton = document.querySelector(".load-more");

const serviceApi = new serviceAPI();

submitButton.addEventListener('click', onSearch);
loadButton.addEventListener('click', onLoadMore);

  
async function onSearch(event) {
    event.preventDefault();
    serviceApi.query = inputArea.value.trim();
    serviceApi.resetPage();
    try {
        const data = await serviceApi.fetchQuery();  
        console.log(data);
        if (data.totalHits === 0 || serviceApi.query === "") {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        appendCardsMarkup(data.hits);
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

async function onLoadMore() {
    try {
        const data = await serviceApi.fetchQuery();
    console.log(data);
    appendCardsMarkup(data.hits)
    }
    catch (error) {
        console.log(error);
    }
};

function appendCardsMarkup(items) {
    gallery.insertAdjacentHTML('beforeend', galleryMarkUp(items));
  }


















