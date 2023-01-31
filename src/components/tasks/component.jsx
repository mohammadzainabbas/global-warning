import React from 'react';

import { Helmet } from 'react-helmet-async';

import { useTheme } from '@mui/material/styles';

import { Grid, Container, Typography } from '@mui/material';

import { AppTasks } from '../../sections/@dashboard/app';

const generateList = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const Tasks = () => {

    const tasks = [
        'Collect and clean datasets',
        'Perform exploratory data analysis (EDA)',
        'Brainstorm different visualisation ideas',
        'Develop and deploy webpage for the project',
        'Presentation and Demo',
        'Public awareness',
        'Demo with interactive Maps',
    ]

    return (
        <React.Fragment>
            <Helmet>
                <title> {`Tasks | Global Warning`} </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    {`List of tasks to be completed`}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AppTasks
                            title="Tasks"
                            list={[
                                { id: '1', label: 'Collect and clean datasets' },
                                { id: '2', label: 'Perform exploratory data analysis (EDA)' },
                                { id: '3', label: 'Brainstorm different visualisation ideas' },
                                { id: '4', label: 'Develop and deploy webpage for the project' },
                                { id: '5', label: 'Presentation and Demo' },
                                { id: '6', label: 'Public awareness' },
                                { id: '7', label: 'Demo with interactive Maps' },
                            ]}
                            taskCompleted={generateList(1, 5).map(i => `${i}`)}
                        />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default Tasks;