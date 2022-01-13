import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles, Grid, FormControl, InputLabel, Input, InputAdornment, FormHelperText, IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from "@material-ui/pickers";
import EmailIcon  from '@material-ui/icons/Email';
import SecurityIcon  from '@material-ui/icons/Security';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useField } from "formik";
import clsx from 'clsx';
import enLocale from "date-fns/locale/en-US";
import DateFnsUtils from "@date-io/date-fns";


const useStyles = makeStyles( ( theme ) => createStyles(
    {
        root: {},

        container: {},

        item: { flexGrow: 1,  },

        margin: {},

        textField: {},

        paper: {
                maxWidth: 936,
                margin: 'auto',
                overflow: 'hidden',
            },

        searchBar: {
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            },

        searchInput: {
                // fontSize: theme.typography.fontSize,
            },

        block: {
                display: 'block',
            },

        addUser: {
                marginRight: theme.spacing(1),
            },

        contentWrapper: {
                margin: '40px 16px',
            },

        priceContainer: { /* marginTop: 20 */ },
        priceNumbers: { width: 57 },
        priceRange: {},

        formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            },
  
} ) );

const TextFieldEx = ({ label, required, fullWidth, children, style, ...props }) =>
    {
        const classes = useStyles();
        const [ field, meta ] = useField(props);
        const isError = !!meta.error && meta.touched;
        const id = `component-helper-${ props.name }`;

        return  <Grid container spacing={ 1 } alignItems="center" wrap="nowrap" className={ classes.container } style={ style } >
                    <Grid item>
                        { children }
                    </Grid>
                    <Grid item className={ classes.item } >

                        <FormControl error={ isError } required={ required } fullWidth={ fullWidth } className={ classes.textField } >
                            <InputLabel htmlFor={ id }>{ label }</InputLabel>
                            <Input id={ id } { ...field } { ...props } aria-describedby="component-helper-text" />
                            <FormHelperText id="component-helper-text">{ isError? meta.error : ' ' }</FormHelperText>
                        </FormControl>

                    </Grid>
                </Grid>;
    }

TextFieldEx.propTypes = 
    {
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        style: PropTypes.object,
    }

const Email = ({ label, required, fullWidth, style, ...props }) =>
    {
        const classes = useStyles();
        const [ field, meta ] = useField(props);
        const isError = !!meta.error && meta.touched;
        const id = `component-helper-${ props.name }`;

        return  <Grid container spacing={ 1 } alignItems="center" className={ classes.container } style={ style } >
                    <Grid item>
                        <EmailIcon />
                    </Grid>
                    <Grid item className={ classes.item } >

                        <FormControl error={ isError } required={ required } fullWidth={ fullWidth } className={ classes.textField } >
                            <InputLabel htmlFor={ id }>{ label }</InputLabel>
                            <Input id={ id } { ...field } { ...props } aria-describedby="component-helper-text" />
                            <FormHelperText id="component-helper-text">{ isError? meta.error : ' ' }</FormHelperText>
                        </FormControl>

                    </Grid>
                </Grid>;
    }

Email.propTypes =
    {
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        style: PropTypes.object,
    };

const Password = ({ label, helperText, required, fullWidth, style, ...props }) =>
    {
        const classes = useStyles();
        const [ field, meta ] = useField(props);
        const [ showPassword, setShowPassword ] = useState( false );
        const isError = !!meta.error && meta.touched;
        const id = `component-helper-${ props.name }`;

        const handleMouseDownPassword = ( event ) => event.preventDefault();

        return  <Grid container spacing={ 1 } alignItems="center" className={ classes.container } wrap="nowrap" style={ style } >
                    <Grid item>
                        <SecurityIcon />
                    </Grid>
                    <Grid item className={ classes.item } >
                        <FormControl error={ isError } required={ required } fullWidth={ fullWidth } className={ clsx( classes.margin, classes.textField ) } >
                            <InputLabel htmlFor={ id }>{ label }</InputLabel>
                            <Input  id={ id } type={ showPassword ? "text" : "password" }
                                    { ...field }
                                    { ...props }
                                    endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility" 
                                                            onClick={ () => setShowPassword( state => !state ) }
                                                            onMouseDown={ handleMouseDownPassword } >
                                                    {
                                                        showPassword ?
                                                            <Visibility />
                                                            :
                                                            <VisibilityOff />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                />
                            <FormHelperText id="component-helper-text">{ isError ? meta.error : (helperText && (field.value?.length || 0) === 0)? helperText : ' ' }</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>;
    }

Password.propTypes =
    {
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        helperText: PropTypes.string,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        style: PropTypes.object,
    };
    
const DatePicker = ({ name, label, format = "dd/MM/yyyy", required, dynamicHelperText, style, ...props}) =>
    {
        const classes = useStyles();
        const isError = !!props.errors[name];
        const id = `component-helper-${ name }`;
        const filler = dynamicHelperText? '' : ' ';

        return (
            <>
                <Grid container spacing={ 1 } alignItems="center" wrap="nowrap" className={ classes.container } style={ style } >

                    <Grid item  >
                        { props.children }
                    </Grid>

                    <Grid item container direction='column' >

                        <MuiPickersUtilsProvider utils={ DateFnsUtils } locale={ enLocale } >
                            <KeyboardDatePicker id={ id } label={ label } inputVariant="standard" format={ format } required={ required }
                                                showTodayButton clearable KeyboardButtonProps={{ "aria-label": "change date" }}
                                                error={ isError } value={ props.values[name] } onChange={ value => props.setFieldValue(name, value) }
                                />
                        </MuiPickersUtilsProvider>

                        <FormHelperText id="component-helper-text" error={ isError } >{ isError? props.errors[name] : filler }</FormHelperText>

                    </Grid>

                </Grid>
            </> );
    }

DatePicker.propTypes =
    {
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        format: PropTypes.string,
        required: PropTypes.bool,
        fullWidth: PropTypes.bool,
        style: PropTypes.object,
    };
    
export { TextFieldEx, Email, Password, DatePicker };
