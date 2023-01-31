import React from 'react';

import { Helmet } from 'react-helmet-async';

import { useTheme } from '@mui/material/styles';

import { Grid, Container, Typography } from '@mui/material';

import { AppTasks } from '../../sections/@dashboard/app';


const Tasks = () => {

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
                                { id: '1', label: 'Collect & clean dataset' },
                                { id: '2', label: 'Add SCSS and JS files if required' },
                                { id: '3', label: 'Stakeholder Meeting' },
                                { id: '4', label: 'Scoping & Estimations' },
                                { id: '5', label: 'Sprint Showcase' },
                            ]}
                            taskCompleted={[`1`, `2`]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default Tasks;