import * as d3 from 'd3';

const URL = "/data/";

export const fetchEmissions = async () => {
    // use `` to append "emissions.csv to variable "URL"
    const data = await d3.csv(``, d3.autoType);
        
    // use d3.csv to fetch the data and return it


    // return await d3.csv(``, d3.autoType);
};
