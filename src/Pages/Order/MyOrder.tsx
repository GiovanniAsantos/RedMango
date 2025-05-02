import { useSelector } from "react-redux/es/hooks/useSelector";
import { useGetAllOrdersQuery } from "../../apis/orderApi";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";
import { MainLoader } from "../../Components/Page/Common";
import OrderList from "../../Components/Page/Order/OrderList";
import { SD_Status } from "../../Utility/SD";

const filterOptions = [
  "All",
  SD_Status.BEING_COOKED,
  SD_Status.CANCELLED,
  SD_Status.CONFIRMED,
  SD_Status.READY_FOR_PICKUP,
];

function MyOrder() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery({ userId });

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items justify-content-between mx-5 mt-5">
            <h1 className="text-success">My Orders</h1>
          </div>
          <OrderList isLoading={isLoading} orderData={data?.result} />
        </>
      )}
    </>
  );
}

export default withAuth(MyOrder);
