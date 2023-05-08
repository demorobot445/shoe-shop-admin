import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import OrderGrid from "./OrderGrid";
import ShippedList from "./ShippedList";
import Deliverd from "./Delivered";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function OrderTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Ordered" />
        <Tab label="Shipped" />
        <Tab label="Delivery" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <OrderGrid />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShippedList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Deliverd />
      </TabPanel>
    </Box>
  );
}
