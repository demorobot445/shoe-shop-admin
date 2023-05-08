import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

type orderType = {
  id: string;
  name: string;
  email: string;
  productName: string;
  price: string;
};
type props = {
  handleOpen: (id: string) => void;
  data: orderType;
};

const PUBLISH_UPDATE_ORDER = gql`
  mutation publishOrder($id: ID) {
    publishOrder(to: PUBLISHED, where: { id: $id }) {
      id
    }
  }
`;

const GET_ORDERED_ORDER = gql`
  query filterOrder {
    orders(where: { statues: "ordered" }) {
      id
      name
      email
      productName
      price
    }
  }
`;

const ADD_TRACKING_ID = gql`
  mutation updateOrder(
    $id: ID
    $trackingID: String
    $company: String
    $status: String
  ) {
    updateOrder(
      data: {
        trackingId: $trackingID
        courierCompany: $company
        statues: $status
      }
      where: { id: $id }
    ) {
      id
    }
  }
`;

const OrderCard: React.FC<props> = ({ handleOpen, data }) => {
  return (
    <Grid item lg={4} xs={12}>
      <Card variant="elevation">
        <CardContent>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>User ID:</Typography>
            <Typography>{data.id}</Typography>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>Name:</Typography>
            <Typography>{data.name}</Typography>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>Email:</Typography>
            <Typography>{data.email}</Typography>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>Product:</Typography>
            <Typography>{data.productName}</Typography>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>Total Price:</Typography>
            <Typography>$ {data.price}</Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <Stack alignItems="flex-end" justifyContent="flex-end" width="100%">
            <Button onClick={() => handleOpen(data.id)} variant="contained">
              Add Tracking ID
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );
};

const OrderGrid = () => {
  const { loading, error: _, data: orderData } = useQuery(GET_ORDERED_ORDER);
  const [addTrackingID] = useMutation(ADD_TRACKING_ID);
  const [publishOrder] = useMutation(PUBLISH_UPDATE_ORDER);

  const [id, setID] = useState<string>("");

  const [open, setOpen] = useState(false);

  const [inputFeildError, setInputFeildError] = useState<{
    id: boolean;
    name: boolean;
  }>({ id: false, name: false });

  const [trackingId, setTrackingId] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const handleClickOpen = (id: string) => {
    setOpen(true);
    setID(id);
  };

  const addAndPublish = async () => {
    try {
      const { data } = await addTrackingID({
        variables: {
          id,
          trackingID: trackingId,
          company: company,
          status: "shipped",
        },
      });

      await publishOrder({
        variables: {
          id: data.updateOrder.id,
        },
        refetchQueries: [{ query: GET_ORDERED_ORDER }],
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleClose = async () => {
    if (trackingId === "" && company === "") {
      setInputFeildError({ id: true, name: true });
    } else if (trackingId === "") {
      setInputFeildError({ id: true, name: false });
    } else if (company === "") {
      setInputFeildError({ id: false, name: true });
    } else {
      toast.promise(addAndPublish, {
        pending: "Data Updating Please Wait..",
        success: "All Done Bro👌",
        error: "Promise rejected 🤯",
      });
      setInputFeildError({ id: false, name: false });
      setTrackingId("");
      setCompany("");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTrackingId("");
    setCompany("");
    setOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Add Order Tracking ID & Courier Company Name
        </DialogTitle>
        <DialogContent>
          <TextField
            error={inputFeildError.id}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            autoFocus
            margin="dense"
            id="trackingid"
            label="Tracking ID"
            type="text"
            fullWidth
            variant="standard"
            focused={inputFeildError.id}
            helperText={inputFeildError.id && "Please fill this feild."}
          />
          <TextField
            error={inputFeildError.name}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            margin="dense"
            id="company"
            label="Company Name"
            type="text"
            fullWidth
            focused={inputFeildError.id ? false : inputFeildError.name}
            variant="standard"
            helperText={inputFeildError.name && "Please fill this feild."}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Order Shipped
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          margin={10}
        >
          <CircularProgress />
        </Stack>
      ) : orderData.orders.length === 0 ? (
        <Typography variant="h4" padding={10} width="100%" align="center">
          No Order Available
        </Typography>
      ) : (
        orderData.orders.map((e: orderType) => {
          return <OrderCard data={e} handleOpen={handleClickOpen} key={e.id} />;
        })
      )}
    </Grid>
  );
};

export default OrderGrid;
