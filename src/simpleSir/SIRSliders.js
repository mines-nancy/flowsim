import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { useTranslate } from 'react-polyglot';
import CreateSlider from './CreateSlider';

const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
    slider: {
        width: 150,
    },
});

export default function Sliders({ onChange }) {
    const classes = useStyles();

    const t = useTranslate();

    const [value_s0, setValue_s0] = React.useState(0);
    const [value_lambda, setValue_lambda] = React.useState(1);
    const [value_beta, setValue_beta] = React.useState(0);

    const values = { s0: value_s0, lambda: value_lambda, beta: value_beta };
    const setValues = {};
    setValues.s0 = setValue_s0;
    setValues.lambda = setValue_lambda;
    setValues.beta = setValue_beta;

    const handleSliderChange = (event, newValue, name) => {
        const setVal = setValues[name];
        setVal(newValue);
        onChange({
            s0: parseFloat(values.s0),
            lambda: parseFloat(values.lambda),
            beta: parseFloat(values.beta),
        });
    };

    const handleInputChange = (event, name) => {
        setValues[name](event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = (event, param, name) => {
        if (event.target.value < event.target.inputProps.min) {
            setValues[name](event.targetinputProps.min);
        }
        if (event.target.value > event.target.inputProps.max) {
            setValues[name](event.target.inputProps.max);
        }
    };

    return (
        <Grid
            className={classes.grid}
            container
            direction="column"
            justify="right"
            alignItems="center"
        >
            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre s0
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            name="s0"
                            className={classes.slider}
                            value={typeof values.s0 === 'number' ? values.s0 : 1}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(event, newValue, name) => handleSliderChange(event, newValue, 's0')}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            name="s0"
                            className={classes.input}
                            value={values.s0}
                            margin="dense"
                            onChange={(event, name) => handleInputChange(event, 's0')}
                            onBlur={(event, newValue, name) => handleBlur(event, newValue, 's0')}
                            inputProps={{
                                step: 1,
                                min: 0,
                                max: 1,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* <CreateSlider name="s0" parameters={params} /> */}

            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre lambda
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            name="lambda"
                            className={classes.slider}
                            value={typeof values.lambda === 'number' ? values.lambda : 1}
                            min={1}
                            max={20}
                            step={1}
                            onChange={(event, newValue, name) => handleSliderChange(event, newValue, 'lambda')}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            name="lambda"
                            className={classes.input}
                            value={values.lambda}
                            margin="dense"
                            onChange={(event, name) => handleInputChange(event, 'lambda')}
                            onBlur={(event, newValue, name) => handleBlur(event, newValue, 'lambda')}
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: 20,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Typography id="input-slider" gutterBottom>
                    Paramètre beta
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            className={classes.slider}
                            name="beta"
                            value={typeof values.beta ? values.beta : 0}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(event, newValue, name) => handleSliderChange(event, newValue, 'beta')}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
                            value={values.beta}
                            margin="dense"
                            onChange={(event, name) => handleInputChange(event, 'beta')}
                            onBlur={(event, newValue, name) => handleBlur(event, newValue, 'beta')}
                            inputProps={{
                                step: 0.01,
                                min: 0,
                                max: 1,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
