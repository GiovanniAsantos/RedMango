import { useGetAllOrdersQuery } from "../../apis/orderApi";
import { MainLoader } from "../../Components/Page/Common";
import OrderList from "../../Components/Page/Order/OrderList";
import { withAuthAdmin } from "../../HOC";

function AllOrders() {
  const { data, isLoading } = useGetAllOrdersQuery("");

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <OrderList isLoading={isLoading} orderData={data?.result} />
      )}
    </>
  );
}

export default withAuthAdmin(AllOrders);
