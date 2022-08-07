import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import serviceAPI from './serviceAPI.js'
import "simplelightbox/dist/simple-lightbox.min.css";

const inputArea = document.querySelector(".search-input");
const submitForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const load = document.querySelector(".button-load")

const serviceApi = new serviceAPI();
let lightbox = {};
let appendedImages = 0;

submitForm.addEventListener('submit', onSearch);
  
async function onSearch(event) {
    event.preventDefault();
    serviceApi.query = inputArea.value.trim();
    serviceApi.resetPage();
    clearGallery();
    window.addEventListener('scroll', endLessScroll);
    try {
        const data = await serviceApi.fetchQuery();  
        if (data.totalHits === 0 || serviceApi.query === "") {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        appendCardsMarkup(data.hits);
        lightBox();
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
    smoothScroll();
    appendedImages += data.hits.length;
    if(appendedImages >= data.totalHits) {
        window.removeEventListener('scroll', endLessScroll);
        load.innerHTML = `<span class="load-message">We're sorry, but you've reached the end of search results.</span>`;
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
    load.innerHTML = "";
};

function smoothScroll(){
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
};

function endLessScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    onLoadMore();
  };
};



