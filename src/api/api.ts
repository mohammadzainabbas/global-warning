import * as d3 from 'd3';

export const fetchEmissions = async () => {
    return await d3.csv('/data/.csv', d3.autoType);
};
