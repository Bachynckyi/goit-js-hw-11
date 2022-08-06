import axios from "axios";

export default class serviceAPI {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchQuery() {
        const BASE_URL = 'https://pixabay.com/api/';
        const KEY = '28946050-edbdf2e2dca91bf63c1cc8e01';
        const URL = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
        try {
            const response = await axios.get(`${URL}`);
            this.page += 1;
            return response.data;   
        }
        catch (error) {
            console.log(error);
        }
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

