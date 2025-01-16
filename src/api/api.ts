import axios from 'axios';

const baseURL = 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues';

export const fetchStaticData = async (venueSlug: string) => {
    const response = await axios.get(`${baseURL}/${venueSlug}/static`);
    console.log(response.data);
    return response.data;
}

export const fetchDynamicData = async (venueSlug: string) => {
    const response = await axios.get(`${baseURL}/${venueSlug}/dynamic`);
    console.log(response.data);
    return response.data;
}