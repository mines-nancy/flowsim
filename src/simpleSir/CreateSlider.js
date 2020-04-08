import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

/* const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
    slider: {
        width: 150,
    },
}); */

const CreateSlider = ({name, parameters}) => {
    //const classes = useStyles();

    return (
        <Grid item>
            <Typography id="input-slider" gutterBottom>
                Paramètre {name}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        //className={classes.slider}
                        value={
                            typeof parameters[name]['value'] === 'number'
                                ? parameters[name]['value']
                                : parameters[name]['max']
                        }
                        min={parameters[name]['min']}
                        max={parameters[name]['max']}
                        step={parameters[name]['step']}
                        onChange={parameters[name]['handleSliderChange']}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        //className={classes.input}
                        value={parameters['name']['value']}
                        margin="dense"
                        onChange={parameters[name]['handleInputChange']}
                        onBlur={parameters[name]['handleBlur']}
                        inputProps={{
                            step: parameters[name]['step'],
                            min: parameters[name]['min'],
                            max: parameters[name]['max'],
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CreateSlider;
