import * as d3 from 'd3';

const URL = "../data";

export const fetchEmissions = async () => {
    return await d3.csv(`${URL}/emissions.csv`, d3.autoType);
};

export const fetchDisasters = async () => {
    return await d3.csv(`${URL}/natural_disasters.csv`, d3.autoType);
};
