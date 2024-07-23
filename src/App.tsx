import { Box, Button, Container, Fade, Grid, TextField } from "@mui/material";
import Header from "./components/Header";
import OrderTabs from "./components/OrderTabs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_PASSWORD = gql`
  query getPassword {
    passwords(first: 1) {
      currentPassword
    }
  }
`;

function App() {
  const [password, setPassword] = useState<string>("");
  const { data } = useQuery(GET_PASSWORD);
  const [isHide, setIsHide] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === data.passwords[0].currentPassword) {
      setIsHide(false);
    } else {
      toast.error("Wrong Password");
      setIsHide(true);
    }
  };

  return (
    <>
      <Container>
        <Fade in={isHide}>
          <form onSubmit={handleSubmit}>
            <Box
              position={"fixed"}
              zIndex={10}
              display={"flex"}
              flexDirection={"column"}
              bgcolor={"white"}
              height={"100%"}
              width={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
              top={0}
              left={0}
            >
              <Box
                width={"100%"}
                maxWidth={350}
                display={"flex"}
                gap={2}
                px={2}
                flexDirection={"column"}
              >
                <TextField
                  size="medium"
                  id="standard-basic"
                  label="Password"
                  type="password"
                  variant="standard"
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <Button
                  sx={{ alignSelf: "flex-end" }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </Fade>
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
