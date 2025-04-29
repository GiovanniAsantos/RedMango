import { useSelector } from "react-redux/es/hooks/useSelector";
import { useGetAllOrdersQuery } from "../../apis/orderApi";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";
import { MainLoader } from "../../Components/Page/Common";
import OrderList from "../../Components/Page/Order/OrderList";

function MyOrder() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery({ userId });

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <OrderList isLoading={isLoading} orderData={data?.result} />
      )}
    </>
  );
}

export default withAuth(MyOrder);
