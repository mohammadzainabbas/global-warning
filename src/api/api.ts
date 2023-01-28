// write a function to fetch the data from the csv file
import { csv } from 'd3-fetch';

export const fetchCSV = async () => {
  const data = await csv('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv');
  return data;
}
