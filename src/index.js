import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import serviceAPI from './serviceAPI.js'
import "simplelightbox/dist/simple-lightbox.min.css";

const inputArea = document.querySelector(".search-input");
const submitForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadButton = document.querySelector(".load-more");

const serviceApi = new serviceAPI();
let lightbox = {};
let appendedImages = 0;

submitForm.addEventListener('submit', onSearch);
  
async function onSearch(event) {
    event.preventDefault();
    serviceApi.query = inputArea.value.trim();
    serviceApi.resetPage();
    clearGallery();
    window.addEventListener('scroll', endlessScroll);
    try {
        const data = await serviceApi.fetchQuery();  
        if (data.totalHits === 0 || serviceApi.query === "") {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        appendCardsMarkup(data.hits);
        lightBox();
        loadButton.classList.remove('is-hidden');
        loadButton.removeAttribute('disabled', true);
        appendedImages = data.hits.length;
    }
    catch (error) {
        console.log(error);
    }
};

async function onLoadMore() {
    try {
    const data = await serviceApi.fetchQuery();
    appendCardsMarkup(data.hits);
    lightbox.refresh();
    smoothScrol();
    appendedImages += data.hits.length;
    if(appendedImages >= data.totalHits) {
        window.removeEventListener('scroll', endlessScroll);
        loadButton.classList.add('is-hidden');
        Notify.failure("We're sorry, but you've reached the end of search results." , {timeout: 100000});
        };
    }
    catch (error) {
        console.log(error);
    };
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
        lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: "alt",
        captionsPosition: "bottom",
        captionsDelay: 250,
        showCounter: false,
        enableKeyboard: true,
    });
};

function appendCardsMarkup(items) {
    gallery.insertAdjacentHTML('beforeend', galleryMarkUp(items));
};

function clearGallery(){
    gallery.innerHTML = "";
};

function smoothScrol(){
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
};

function endlessScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
        onLoadMore();
    };
};






