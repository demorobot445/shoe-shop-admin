import { Container, Grid } from "@mui/material";
import Header from "./components/Header";
import OrderTabs from "./components/OrderTabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Container>
        <ToastContainer />
        <Header />
        <Grid sx={{ paddingTop: 8 }} container>
          <OrderTabs />
        </Grid>
      </Container>
    </>
  );
}

export default App;
