import React, { useState, useEffect, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import { Grid, makeStyles, Card, CardContent } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import Layout from '../../components/Layout';
import DurationField from '../../components/fields/DurationField';
import AutoSave from '../../components/fields/AutoSave';

import api from '../../api';
import Chart from './Chart';
import TimeframeStepper from './TimeframeStepper';
import TotalPopulation from './TotalPopulation';
import ExposedPopulation from './ExposedPopulation';
import { SwitchPercentField } from '../../components/fields/SwitchPercentField';
import { addDays, differenceInDays, isSameDay } from 'date-fns';

const sirEdgesColorCode = '#00688B';
const hEdgesColorCode = 'red';

const colors = {
    incubation: {
        main: 'rgb(164, 18, 179)',
        bg: 'rgba(164, 18, 179, 0.6)',
    },
    normal_care: {
        main: 'rgb(255, 88, 132)',
        bg: 'rgba(255, 88, 132, 0.6)',
    },
    intensive_care: {
        main: 'rgb(54, 162, 235)',
        bg: 'rgba(54, 162, 235, 0.6)',
    },
    following_care: {
        main: 'rgb(54, 54, 255)',
        bg: 'rgba(54, 54, 255, 0.6)',
    },
    death: {
        main: 'rgb(88, 88, 88)',
        bg: 'rgba(88, 88, 88, 0.6)',
    },
    recovered: {
        main: 'rgb(88, 235, 88)',
        bg: 'rgba(88, 235, 88, 0.6)',
    },
};

const NodeWithPercentContainer = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const GridWithLeftGutter = ({ children, ...props }) => (
    <Grid container xs={12}>
        <Grid container xs={2} />
        <Grid container xs={10}>
            <Grid {...props}>{children}</Grid>
        </Grid>
    </Grid>
);

const round = (x) => Math.round(x * 100) / 100;

const mapObject = (obj, keys, fn) =>
    obj
        ? keys.reduce((acc, key) => {
              acc[key] = fn(obj[key]);
              return acc;
          }, {})
        : {};

const defaultParameters = {
    population: 500000,
    patient0: 1,
    kpe: 60,
    r: 2.3,
    dm_incub: 3,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 8,
    dm_ss: 14,
    beta: 0.15,
    pc_ir: 84,
    pc_ih: round(100 - 84),
    pc_sm: 80,
    pc_si: round(100 - 80),
    pc_sm_si: 20,
    pc_sm_other: round(100 - 20), // This field is not sent to the API
    pc_sm_dc: 20,
    pc_sm_out: round(100 - 20),
    pc_si_dc: 50,
    pc_si_out: 50,
    pc_h_ss: 20,
    pc_h_r: round(100 - 20),
    lim_time: 250,
    start_date: new Date(2020, 0, 23),
};

const percentFields = [
    'kpe',
    'pc_ir',
    'pc_ih',
    'pc_sm',
    'pc_si',
    'pc_sm_si',
    'pc_sm_out',
    'pc_sm_dc',
    'pc_sm_other',
    'pc_si_dc',
    'pc_si_out',
    'pc_h_ss',
    'pc_h_r',
];

const removeMedicalCareSplit = ({ pc_sm_other, ...parameters }) => ({
    ...parameters,
    pc_sm_dc: parameters.pc_sm_dc * pc_sm_other,
    pc_sm_out: parameters.pc_sm_out * pc_sm_other,
});

const formatParametersForModel = ({ start_date, ...parameters }, firstTimeframeStartDate) =>
    removeMedicalCareSplit({
        ...parameters,
        ...mapObject(parameters, percentFields, (x) => round(x / 100)),
        start_time: differenceInDays(start_date, firstTimeframeStartDate),
    });

const useStyles = makeStyles(() => ({
    configuration: {
        width: '100%',
    },
}));

const getModel = async (parameterList) => {
    const { data } = await api.get('/get_sir_h_timeframe', {
        params: { parameters: { list: parameterList } },
    });

    return data;
};

const checkHasSameDate = (date) => ({ start_date }) => isSameDay(start_date, date);

const getModelDebounced = AwesomeDebouncePromise(getModel, 500);

const Simulation = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState();
    const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);
    const [timeframes, setTimeframes] = useState([
        { ...defaultParameters, start_time: 0, name: 'Période initiale' },
    ]);
    const [expanded, setExpanded] = useState(false);
    const handleExpansionChange = (evt, value) => setExpanded(value);

    const handleSubmit = useCallback(
        (values) => {
            const timeframesWithoutCurrent = [...timeframes];
            timeframesWithoutCurrent.splice(selectedTimeframeIndex, 1);

            if (timeframesWithoutCurrent.some(checkHasSameDate(values.start_date))) {
                return;
            }

            setTimeframes((list) => {
                const newList = [...list];
                newList[selectedTimeframeIndex] = values;
                newList.sort((a, b) => a.start_date - b.start_date);
                setSelectedTimeframeIndex(
                    newList.findIndex((timeframe) => timeframe.start_date === values.start_date),
                );
                return newList;
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedTimeframeIndex],
    );

    const refreshLines = () => {
        window.dispatchEvent(new CustomEvent('graph:refresh:start'));

        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('graph:refresh:stop'));
        }, 16);
    };

    const handleAddTimeframe = () => {
        setTimeframes((list) => {
            const lastItem = list[list.length - 1];
            const startDate = addDays(lastItem.start_date, 1);

            return [
                ...list,
                {
                    ...lastItem,
                    start_date: startDate,
                    name: 'Nouvelle période',
                },
            ];
        });

        if (expanded) {
            refreshLines();
        } else {
            setExpanded(true);
        }
    };

    const handleRemoveTimeframe = (index) => {
        setTimeframes((list) => {
            // Can't remove if there's only 1 parameter
            if (list.length === 1) {
                return;
            }

            const newList = [...list];
            newList.splice(index, 1);
            return newList;
        });

        refreshLines();

        // Reset index if current index is deleted
        if (selectedTimeframeIndex === index) {
            setSelectedTimeframeIndex(0);
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getModelDebounced(
                timeframes.map((parameters) =>
                    formatParametersForModel(parameters, timeframes[0].start_date),
                ),
            );
            setValues(data);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(timeframes)]);

    return (
        <Layout loading={loading}>
            <Grid container>
                <Grid item xs={6}>
                    {values && <Chart values={values} startDate={timeframes[0].start_date} />}
                </Grid>
                <Grid item xs={6} style={{ backgroundColor: '#eee' }}>
                    <TimeframeStepper
                        timeframes={timeframes}
                        selectedTimeframeIndex={selectedTimeframeIndex}
                        setSelectedTimeframeIndex={setSelectedTimeframeIndex}
                        onAddTimeframe={handleAddTimeframe}
                        onRemoveTimeframe={handleRemoveTimeframe}
                    />
                    <Form
                        // Reset the form at each timeframe change
                        key={timeframes[selectedTimeframeIndex].start_date}
                        subscription={{}}
                        onSubmit={() => {
                            /* Useless since we use a listener on autosave */
                        }}
                        initialValues={timeframes[selectedTimeframeIndex]}
                        render={() => (
                            <div className={classes.configuration}>
                                <AutoSave save={handleSubmit} debounce={200} />
                                <GraphProvider>
                                    <Grid
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Node
                                            name="population_totale"
                                            targets={[
                                                {
                                                    name: 'population_saine_exposee',
                                                    options: {
                                                        color: sirEdgesColorCode,
                                                        path: 'straight',
                                                    },
                                                },
                                            ]}
                                        >
                                            <TotalPopulation
                                                expanded={expanded}
                                                handleExpansionChange={handleExpansionChange}
                                            />
                                        </Node>
                                    </Grid>
                                    <Grid
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Node
                                            name="population_saine_exposee"
                                            targets={[
                                                {
                                                    name: 'incubation',
                                                    options: {
                                                        color: sirEdgesColorCode,
                                                        path: 'straight',
                                                    },
                                                },
                                            ]}
                                        >
                                            <ExposedPopulation />
                                        </Node>
                                    </Grid>
                                    <Grid
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <NodeWithPercentContainer>
                                            <Node name="incubation" targets={[]}>
                                                <Field
                                                    name="dm_incub"
                                                    label="Incubation"
                                                    component={DurationField}
                                                    color={colors.incubation.bg}
                                                />
                                            </Node>
                                            <Node
                                                name="percent_incubation"
                                                targets={[
                                                    {
                                                        name: 'retablissement_spontane',
                                                        options: {
                                                            color: sirEdgesColorCode,
                                                            path: 'grid',
                                                        },
                                                    },
                                                    {
                                                        name: 'hospitalisation',
                                                        options: {
                                                            color: sirEdgesColorCode,
                                                            path: 'grid',
                                                        },
                                                    },
                                                ]}
                                            >
                                                <SwitchPercentField
                                                    leftName="pc_ir"
                                                    rightName="pc_ih"
                                                    leftLabel="Rétablissements"
                                                    rightLabel="Hospitalisations"
                                                    leftColor={colors.recovered.main}
                                                    rightColor={colors.normal_care.main}
                                                />
                                            </Node>
                                        </NodeWithPercentContainer>
                                    </Grid>
                                    <Grid
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Grid container xs={1} />
                                        <Grid container xs={5} justify="flex-start">
                                            <Node
                                                name="retablissement_spontane"
                                                alignmentBase="left"
                                                targets={[
                                                    {
                                                        name: 'guerison',
                                                        options: {
                                                            color: sirEdgesColorCode,
                                                            path: 'straight',
                                                            anchorStart: { x: 25 },
                                                            anchorEnd: { x: 25 },
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    name="dm_r"
                                                    label={
                                                        <>
                                                            Rétablissement
                                                            <br />
                                                            spontané
                                                        </>
                                                    }
                                                    component={DurationField}
                                                />
                                            </Node>
                                        </Grid>

                                        <Grid container xs={5} justify="flex-end">
                                            <NodeWithPercentContainer>
                                                <Node name="hospitalisation" targets={[]}>
                                                    <Field
                                                        name="dm_h"
                                                        label="Hospitalisation"
                                                        component={DurationField}
                                                    />
                                                </Node>
                                                <Node
                                                    name="percent_hospital"
                                                    targets={[
                                                        {
                                                            name: 'soins_medicaux',
                                                            options: {
                                                                color: hEdgesColorCode,
                                                                path: 'grid',
                                                            },
                                                        },
                                                        {
                                                            name: 'soins_intensifs',
                                                            options: {
                                                                color: hEdgesColorCode,
                                                                path: 'grid',
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <SwitchPercentField
                                                        leftName="pc_sm"
                                                        rightName="pc_si"
                                                        leftLabel="Soins médicaux"
                                                        rightLabel="Soins intensifs"
                                                        leftColor={colors.normal_care.main}
                                                        rightColor={colors.intensive_care.main}
                                                    />
                                                </Node>
                                            </NodeWithPercentContainer>
                                        </Grid>
                                        <Grid container xs={1} />
                                    </Grid>

                                    <GridWithLeftGutter
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Grid container xs={5} justify="center">
                                            <NodeWithPercentContainer>
                                                <Node name="soins_medicaux" targets={[]}>
                                                    <Field
                                                        name="dm_sm"
                                                        label="Soins médicaux"
                                                        component={DurationField}
                                                        color={colors.normal_care.bg}
                                                    />
                                                </Node>
                                                <Node
                                                    name="percent_soins_medicaux"
                                                    targets={[
                                                        {
                                                            name: 'post_soins_medicaux',
                                                            options: {
                                                                color: hEdgesColorCode,
                                                                path: 'straight',
                                                            },
                                                        },
                                                        {
                                                            name: 'soins_intensifs',
                                                            options: {
                                                                color: hEdgesColorCode,
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <SwitchPercentField
                                                        leftName="pc_sm_other"
                                                        rightName="pc_sm_si"
                                                        leftLabel="Sortie ou Décès"
                                                        rightLabel="Soins intensifs"
                                                        leftColor="grey"
                                                        rightColor={colors.intensive_care.main}
                                                    />
                                                </Node>
                                            </NodeWithPercentContainer>
                                        </Grid>
                                        <Grid container xs={2} />
                                        <Grid container xs={5} justify="center">
                                            <Node
                                                name="soins_intensifs"
                                                targets={[
                                                    {
                                                        name: 'percent_si',
                                                        options: {
                                                            color: hEdgesColorCode,
                                                            path: 'straight',
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    name="dm_si"
                                                    label="Soins intensifs"
                                                    component={DurationField}
                                                    color={colors.intensive_care.bg}
                                                />
                                            </Node>
                                        </Grid>
                                    </GridWithLeftGutter>

                                    <GridWithLeftGutter
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Grid container xs={5} justify="center">
                                            <Node
                                                name="post_soins_medicaux"
                                                targets={[
                                                    {
                                                        name: 'deces',
                                                        options: {
                                                            path: 'straight',
                                                            color: hEdgesColorCode,
                                                            anchorStart: { x: '100%', y: '50%' },
                                                            anchorEnd: { x: '0%', y: '50%' },
                                                        },
                                                    },
                                                    {
                                                        name: 'gueris_ou_soins_suite',
                                                        options: {
                                                            color: hEdgesColorCode,
                                                            path: 'grid',
                                                        },
                                                    },
                                                ]}
                                            >
                                                <SwitchPercentField
                                                    leftName="pc_sm_out"
                                                    rightName="pc_sm_dc"
                                                    leftLabel="Sortie"
                                                    rightLabel="Décès"
                                                    leftColor={colors.recovered.main}
                                                    rightColor={colors.death.main}
                                                />
                                            </Node>
                                        </Grid>
                                        <Grid container xs={2} justify="center">
                                            <Node name="deces">
                                                <Card
                                                    className={classes.card}
                                                    elevation={3}
                                                    style={{
                                                        backgroundColor: colors.death.bg,
                                                    }}
                                                >
                                                    <CardContent>Décès</CardContent>
                                                </Card>
                                            </Node>
                                        </Grid>
                                        <Grid container xs={5} justify="center">
                                            <Node
                                                name="percent_si"
                                                targets={[
                                                    {
                                                        name: 'gueris_ou_soins_suite',
                                                        options: {
                                                            color: hEdgesColorCode,
                                                            path: 'grid',
                                                        },
                                                    },
                                                    {
                                                        name: 'deces',
                                                        options: {
                                                            path: 'straight',
                                                            color: hEdgesColorCode,
                                                            anchorStart: { x: '0%', y: '50%' },
                                                            anchorEnd: { x: '100%', y: '50%' },
                                                        },
                                                    },
                                                ]}
                                            >
                                                <SwitchPercentField
                                                    leftName="pc_si_dc"
                                                    rightName="pc_si_out"
                                                    leftLabel="Décès"
                                                    rightLabel="Sortie"
                                                    leftColor={colors.death.main}
                                                    rightColor={colors.recovered.main}
                                                />
                                            </Node>
                                        </Grid>
                                    </GridWithLeftGutter>

                                    <GridWithLeftGutter
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Node
                                            name="gueris_ou_soins_suite"
                                            targets={[
                                                {
                                                    name: 'soins_suite',
                                                    options: {
                                                        color: hEdgesColorCode,
                                                        path: 'grid',
                                                    },
                                                },
                                                {
                                                    name: 'after_soins_suite',
                                                    options: {
                                                        color: hEdgesColorCode,
                                                        path: 'grid',
                                                    },
                                                },
                                            ]}
                                        >
                                            <SwitchPercentField
                                                leftName="pc_h_r"
                                                rightName="pc_h_ss"
                                                leftLabel="Guérison"
                                                rightLabel="Soins de suite"
                                                leftColor={colors.recovered.main}
                                                rightColor={colors.following_care.main}
                                            />
                                        </Node>
                                    </GridWithLeftGutter>

                                    <GridWithLeftGutter container xs={12} justify="center">
                                        <Grid container xs={7} />
                                        <Grid container xs={5}>
                                            <Node
                                                name="soins_suite"
                                                targets={[
                                                    {
                                                        name: 'after_soins_suite',
                                                        options: {
                                                            color: hEdgesColorCode,
                                                            path: 'grid',
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Field
                                                    name="dm_ss"
                                                    label="Soins de suite"
                                                    component={DurationField}
                                                    color={colors.following_care.bg}
                                                />
                                            </Node>
                                        </Grid>
                                    </GridWithLeftGutter>

                                    <GridWithLeftGutter
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Node
                                            name="after_soins_suite"
                                            targets={[
                                                {
                                                    name: 'guerison',
                                                    options: {
                                                        color: hEdgesColorCode,
                                                        path: 'grid',
                                                    },
                                                },
                                            ]}
                                        ></Node>
                                    </GridWithLeftGutter>

                                    <Grid
                                        container
                                        xs={12}
                                        justify="center"
                                        style={{ margin: '4rem 0' }}
                                    >
                                        <Grid container xs={1} />
                                        <Grid container xs={11} justify="flex-start">
                                            <Node name="guerison">
                                                <Card
                                                    className={classes.card}
                                                    elevation={3}
                                                    style={{
                                                        backgroundColor: colors.recovered.bg,
                                                    }}
                                                >
                                                    <CardContent>Guérison</CardContent>
                                                </Card>
                                            </Node>
                                        </Grid>
                                        <Grid container xs={6} justify="center" />
                                    </Grid>
                                    <Edges />
                                </GraphProvider>
                            </div>
                        )}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Simulation;
