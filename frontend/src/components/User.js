import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AccountCircle  from '@material-ui/icons/AccountCircle';
import TextFieldsIcon  from '@material-ui/icons/TextFields';
import ScheduleIcon from '@material-ui/icons/Schedule';

import { TextFieldEx, Email, Password, DatePicker } from './UI';


const useStyles = makeStyles( (theme) => (
    {
        container:
            {
                maxWidth: '80vw',
                margin: '50px auto 0 auto'
            },

        textInfo:
            {
                marginTop: 20,
                marginBottom: 20
            },

        table: { minWidth: 450 },

        buttonBox:
            {
                padding: 30,
                "& > * + *": { marginLeft: theme.spacing(4) },
            },

        buttons: {},

        dialog: { width: 500, margin: 'auto' },

        dialogTitle: { textAlign: "center" },
    }) );

function User({ user = {}, onCreate, onModify, ...props })
{
    const classes = useStyles();
    const navigate = useNavigate();
    const params = useParams();
    
    // console.log('User, user:', user);

    const { name = '', surname = '', birth_date = new Date(), email = '', password = '', phone = '', identity = '', passport_number = '' } = user;

    const initialValues = { name, surname, birth_date, email, password, passwordConfirmation: '', phone, identity, passport_number };
    const validationSchemaRequired = Yup.object().shape(
        {
            name: Yup.string().min(3, "Your name must be at least 3 letters long").required( "This field is required" ),
            surname: Yup.string().min(3, "Your surname must be at least 3 letters long").required( "This field is required" ),
            birth_date: Yup.date().max(new Date(), "Your birth date must be in the past").required( "This field is required" ),
            email: Yup.string().email("Please provide valid email address").required( "This field is required" ),
            password: Yup.string().test( "match", "Password must be at least 5 letters long and contain at least 1 capital, 1 lower-case letters, 1 digit and of of next symbols: *[!@#$%^&.*\\-_",
                function Comparator()
                {
                    return /^(?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.*[!@#$%^&*\-_`~;:'"])+(?=.{5,})/.test(this.parent.password);
                } ).required( "This field is required" ),
            passwordConfirmation: Yup.mixed().test( "match", "Passwords do not match",
                function Comparator()
                {
                    return this.parent.password === this.parent.passwordConfirmation;
                } ),
            phone: Yup.string().min(2, "Your first name must be at least 2 letters long").required( "This field is required" ),
            identity: Yup.string().min(2, "Your last name must be at least 2 letters long").required( "This field is required" ),
            passport_number: Yup.string().min(2, "Your last name must be at least 2 letters long").required( "This field is required" ),
        } );

    const validationSchemaOptional = Yup.object().shape(
        {
            name: Yup.string().min(3, "Your name must be at least 3 letters long").optional(),
            surname: Yup.string().min(3, "Your surname must be at least 3 letters long").optional(),
            birth_date: Yup.date().max(new Date(), "Your birth date must be in the past").optional(),
            email: Yup.string().email("Please provide valid email address").optional(),
            password: Yup.string().test( "match", "Password must be at least 5 letters long and contain at least 1 capital, 1 lower-case letters, 1 digit and of of next symbols: *[!@#$%^&.*\\-_",
                function Comparator()
                {
                    return this.parent.password? /^(?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.*[!@#$%^&*\-_`~;:'"])+(?=.{5,})/.test(this.parent.password) : true;
                } ),
            passwordConfirmation: Yup.mixed().test( "match", "Passwords do not match",
                function Comparator()
                {
                    return this.parent.password === this.parent.passwordConfirmation;
                } ),
            phone: Yup.string().min(2, "Your first name must be at least 2 letters long").optional(),
            identity: Yup.string().min(2, "Your last name must be at least 2 letters long").optional(),
            passport_number: Yup.string().min(2, "Your last name must be at least 2 letters long").optional(),
        } );

    const handleSubmit = (values, helpers) =>
        {
            helpers.setSubmitting( true );

            if (!params.id)
            {
                values.birth_date = values.birth_date.getTime();
                
                onCreate( values );
            }
            else
            {
                const filtered = Object.entries(values).reduce( (res, pair) => 
                    {
                        if (pair[1] && pair[1] !== initialValues[pair[0]])
                            res[ pair[0] ] = pair[1];

                        return res;
                    },
                    {} );

                if (filtered.birth_date)
                    filtered.birth_date = filtered.birth_date.getTime();
            
                if (Object.keys(filtered).length)
                    onModify( params.id, filtered );
            }

            helpers.setSubmitting( false );

            navigate( -1 );
        };

    return (
        <div style={{  width: 600, margin: 'auto' }}>

                <Typography align="center" variant="h5" color="textPrimary" className={ classes.textInfo } >
                    { params.id? "Edit user details" : "Create new user" }
                </Typography>

                <Formik initialValues={ initialValues } onSubmit={ handleSubmit } validationSchema={ !params.id ? validationSchemaRequired : validationSchemaOptional } >
                    {
                        (props) => 
                            {
                                // console.log('renderer:', props);
                                
                                return (
                                    <Form>
                                        <TextFieldEx label="Enter user name" name="name" fullWidth required={ !params.id } > <AccountCircle /> </TextFieldEx>
                                        <TextFieldEx label="Enter user surname" name="surname" fullWidth required={ !params.id } > <AccountCircle /> </TextFieldEx>
                                        {/* <TextFieldEx label="Enter user birth date" name="birth_date" fullWidth required={ !params.id } > <AccountCircle /> </TextFieldEx> */}
                                        <DatePicker label="Enter user birth date" name="birth_date" fullWidth required={ !params.id } { ...props } > <ScheduleIcon /> </DatePicker>
                                        <Email label="Enter user email" name="email" fullWidth  required={ !params.id }  />
                                        <Password label="Enter user password" name="password" fullWidth required={ !params.id }  />
                                        <Password label="Confirm user password" name="passwordConfirmation" fullWidth required={ !params.id }  />
                                        <TextFieldEx label="Enter phone number" name="phone" fullWidth required={ !params.id } > <TextFieldsIcon /> </TextFieldEx>
                                        <TextFieldEx label="Enter user identity" name="identity" fullWidth required={ !params.id } > <TextFieldsIcon /> </TextFieldEx>
                                        <TextFieldEx label="Enter user passport number" name="passport_number" fullWidth required={ !params.id } > <TextFieldsIcon /> </TextFieldEx>

                                        <Grid container justifyContent="space-evenly" >
                                            <Button color="primary" variant="contained" type="submit">
                                                Submit
                                            </Button>

                                            <Button color="primary" variant="contained" onClick={ () => navigate(-1) }>
                                                Cancel
                                            </Button>

                                        </Grid>
                                    </Form> );
                            }
                    }
                </Formik>
            
        </div>
    );
}

User.propType = 
    {
        user: PropTypes.array,
        onCreate: PropTypes.func.isRequired,
        onModify: PropTypes.func.isRequired,
    }

export default User;
