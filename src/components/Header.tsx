import { AppBar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar>
      <Typography align="center" variant="h5" sx={{ my: 2, ml: 2 }}>
        Order Management
      </Typography>
    </AppBar>
  );
};

export default Header;
