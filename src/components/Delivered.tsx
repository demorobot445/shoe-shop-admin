import { gql, useQuery } from "@apollo/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const GET_DELVERED_ORDER = gql`
  query filterOrder {
    orders(where: { statues: "delivered" }) {
      id
      name
      email
      productName
      price
      trackingId
      courierCompany
      stripePaymentId
    }
  }
`;

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "stripePaymentId", headerName: "Stripe ID", width: 200 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "productName", headerName: "Product Name", width: 130 },
  {
    field: "price",
    headerName: "Price",
    width: 90,
  },
  { field: "trackingId", headerName: "Tracking ID", width: 130 },
];

export default function Deliverd() {
  const { loading, error: _err, data } = useQuery(GET_DELVERED_ORDER);

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={data ? data.orders : []}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
