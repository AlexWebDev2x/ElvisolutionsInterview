import NavBar from '../components/AppBar';


const Layout = (props) =>
    {
        return (
            <>
                <NavBar />

                { props.children }

            </> )
    };

export default Layout;