// write a function to fetch the data from the csv file
import { csv } from 'd3-fetch';

export const fetchCSV = async () => {
    return await csv('./data/owid-covid-data.csv');
}
