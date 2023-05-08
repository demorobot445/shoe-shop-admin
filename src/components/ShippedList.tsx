import {
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { client } from "../main";

const GET_SHIPPED_ORDER = gql`
  query filterOrder {
    orders(where: { statues: "shipped" }) {
      id
      email
      trackingId
    }
  }
`;

const PUBLISH_UPDATE_ORDER = gql`
  mutation publishOrder($id: ID) {
    publishOrder(to: PUBLISHED, where: { id: $id }) {
      id
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation updateOrder($status: String, $id: ID) {
    updateOrder(data: { statues: $status }, where: { id: $id }) {
      id
    }
  }
`;

type dataType = {
  id: string;
  email: string;
  trackingId: string;
};

const ShippedList = () => {
  const { loading, error: _err, data } = useQuery(GET_SHIPPED_ORDER);
  const [updateStatus] = useMutation(UPDATE_STATUS);
  const [publishOrder] = useMutation(PUBLISH_UPDATE_ORDER);

  const updateAndPublish = async (id: string) => {
    try {
      const { data } = await updateStatus({
        variables: {
          id,
          status: "delivered",
        },
      });
      await publishOrder({
        variables: {
          id: data.updateOrder.id,
        },
        refetchQueries: [{ query: GET_SHIPPED_ORDER }],
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleClick = async (id: string) => {
    toast.promise(() => updateAndPublish(id), {
      pending: "Please Updating Data..",
      error: "Something Wrong..!",
      success: "Order Delivered.",
    });
  };

  useEffect(() => {
    client.refetchQueries({
      include: [GET_SHIPPED_ORDER],
    });
  }, []);

  return (
    <List sx={{ maxWidth: 500, margin: "auto" }}>
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
      ) : (
        data.orders.map((e: dataType) => {
          return (
            <React.Fragment key={e.id}>
              <ListItem
                secondaryAction={
                  <Tooltip title="Order Delivery Successful">
                    <IconButton
                      onClick={() => handleClick(e.id)}
                      edge="end"
                      aria-label="comments"
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={e.email}
                  secondary={`Tracking ID : ${e.trackingId}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })
      )}
    </List>
  );
};

export default ShippedList;
