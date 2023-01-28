import * as d3 from 'd3';

export const fetchCSV = async () => {
    return await d3.csv('./data/owid-covid-data.csv', d3.autoType);
};
