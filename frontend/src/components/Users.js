import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import MuiTableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MuiLink from "@material-ui/core/Link";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';


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

        tableContainer: { border: '1px solid darkgray' },

        tableHead: { backgroundColor: 'lightgrey' },

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

const TableRow = withStyles(
    {
        root:
            {
                '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'lightblue' }
            }
    })(MuiTableRow);

const Link = withStyles(
    {
        root:
            {
                "&[disabled]":
                    {
                        color: "grey",
                        cursor: "default",
                        "&:hover": { textDecoration: "none" },
                    }
            }
    })(MuiLink);

function Users(props)
{
    const classes = useStyles();
    const navigate = useNavigate();

    const [ selections, setSelections ] = useState({});

    useEffect( () => 
        setSelections( props.users.reduce( (sel, user) => { sel[user.id] = (props.selected === user.id); return sel; }, {} ) ), 
        [ props.users, props.selected ]);

    const [ viewerOpened, setViewerOpened ] = useState( false );

    // console.log('[selections]:', selections);

    const handleClick = (event, id) =>
        {
            const ns = {};

            for (let s in selections)
                ns[s] = (s !== id)? false : !(selections[id]);

            // console.log('handleClick - selections:', selections, { ...selections });

            props.onSelectionChanged( ns[id] ? id : "-1" );
            
            setSelections( ns );
        };

    const selectedUser = props.selected !== "-1" ? props.users.find( u => u.id === props.selected) : {};

    // console.log('[Users] selectedUser:', selectedUser);

    const navigateToCreate = useCallback( () => navigate("/users/modify"), [ navigate ] );
    const navigateToEdit = useCallback( () => navigate(`/users/modify/${ props.selected !== "-1" ? props.selected: '' }`), [ navigate, props.selected ] );
    const openViewer = () => setViewerOpened( true );
    const closeViewer = () => setViewerOpened( false );
    const redirectToEdit = () => { closeViewer(); navigateToEdit() };
    const deleteUser = useCallback( () => window.confirm(`Delete selected user?`)? props.onDelete(props.selected) : {}, [ props ]);

    return (
        <div className={ classes.container } >

            <Typography align="center" variant="h5" color="textPrimary" className={ classes.textInfo } >
                List of existing users
            </Typography>

            <TableContainer component={ Paper } className={ classes.tableContainer } >

                <Table className={ classes.table } aria-label="simple table">

                    <TableHead className={ classes.tableHead } >
                        <TableRow>
                            <TableCell align="left">Full name</TableCell>
                            <TableCell align="center">Birth data</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Identity</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            props.users.map((user, index) => (
                                <TableRow key={ user.id } 
                                          onClick={ (event) => handleClick(event, user.id) } 
                                          selected={ selections[user.id] } 
                                        >
                                    <TableCell align="left" component="th" scope="row"> { ` ${ user.name } ${ user.surname } ` } </TableCell>
                                    <TableCell align="center"> { user.birth_date.toLocaleDateString()/* split('T')[0] */ } </TableCell>
                                    <TableCell align="center"> { user.email } </TableCell>
                                    <TableCell align="center"> { user.phone } </TableCell>
                                    <TableCell align="center"> { user.identity } </TableCell>
                                </TableRow> ))
                        }
                    </TableBody>

                </Table>
                
            </TableContainer>

            <Grid container justifyContent="center" className={ classes.buttonBox } >

                <Grid item className={ classes.buttons }>
                    <Link component="button" onClick={ navigateToCreate } >
                        <Typography variant="h6" noWrap className={ classes.textArea_center }>
                            Create
                        </Typography>
                    </Link>
                </Grid>

                <Grid item className={ classes.buttons }>
                    <Link component="button" onClick={ openViewer } disabled={ props.selected === "-1" } >
                        <Typography variant="h6" noWrap className={ classes.textArea_center }>
                            View
                        </Typography>
                    </Link>
                </Grid>

                <Grid item className={ classes.buttons }>
                    <Link component="button" onClick={ navigateToEdit } disabled={ props.selected === "-1" } >
                        <Typography variant="h6" noWrap className={ classes.textArea_center }>
                            Edit
                        </Typography>
                    </Link>
                </Grid>

                <Grid item className={ classes.buttons }>
                    <Link component="button" onClick={ deleteUser } disabled={ props.selected === "-1" } >
                        <Typography variant="h6" noWrap className={ classes.textArea_center }>
                            Delete
                        </Typography>
                    </Link>
                </Grid>

            </Grid>

            {
                viewerOpened &&
                    <Dialog open={ viewerOpened } onClose={ closeViewer } aria-labelledby="form-dialog-title" className={ classes.dialog } >

                        <DialogTitle id="form-dialog-title" className={ classes.dialogTitle }>User details</DialogTitle>

                        <DialogContent>

                            <TextField id="name" label="Name" defaultValue={ selectedUser.name } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="surname" label="Surname" defaultValue={ selectedUser.surname } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="birth_date" label="Birth Date" value={ selectedUser.birth_date.toLocaleDateString() } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="email" label="Email Address" defaultValue={ selectedUser.email } type="email" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="phone" label="Phone Number" defaultValue={ selectedUser.phone } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="identity" label="Identity" defaultValue={ selectedUser.identity } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />
                            <TextField id="passport_number" label="Passport Number" defaultValue={ selectedUser.passport_number } type="text" InputProps={ { readOnly: true } } fullWidth margin="normal" />

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={ redirectToEdit } color="primary">
                                Edit
                            </Button>
                            <Button onClick={ closeViewer } color="primary">
                                Close
                            </Button>
                        </DialogActions>

                    </Dialog>
            }

        </div>
    );
}

Users.propTypes = 
    {
        users: PropTypes.array.isRequired,
        selected: PropTypes.string.isRequired,
        onSelectionChanged: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
    };

export default Users;
