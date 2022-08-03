import axios from "axios";

export default async function getImage(searchQuery) {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '28946050-edbdf2e2dca91bf63c1cc8e01';
    const URL = `${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
    try {
        const response = await axios.get(`${URL}`);
        return response.data;   
    }
    catch (error) {
        console.log(error);
    }

    
}




