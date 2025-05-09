import { useParams } from "react-router-dom";
import { useGetMenuItemsByIdQuery } from "../apis/menuItemApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUpdateShoppingCartMutation } from "../apis/shoppingCartApi";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import { toastNotify } from "../Helper";
import { apiResponse, userModel } from "../Interfaces";
import { RootState } from "../Storage/Redux/store";
import { useSelector } from "react-redux";

function MenuItemDetails() {
  const navigate = useNavigate();
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const { data, isLoading } = useGetMenuItemsByIdQuery(menuItemId);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData : userModel = useSelector((state: RootState) => state.userAuthStore);

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (newQuantity === 0) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async (menuItemId: number) => {
    if(!userData.id){
      navigate("/login")
      return
    }
    setIsAddingToCart(true);

    const response: apiResponse = await updateShoppingCart({
      menuItemId: menuItemId,
      updateQuantityBy: quantity,
      userId: userData.id,
    });

    if (response.data && response.data.isSuccess) {
      toastNotify("Item added to cart successfully!");
    }

    setIsAddingToCart(false);
  };

  if (!menuItemId) {
    return <div>Invalid menu item ID</div>;
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <MainLoader />
      </div>
    );
  }

  return (
    <div className="container pt-4 pt-md-5">
      <div className="row">
        <div className="col-7">
          <h2 className="text-success">{data.result.name}</h2>
          <span>
            <span
              className="badge text-bg-dark pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.result.category}
            </span>
          </span>
          <span>
            <span
              className="badge text-bg-light pt-2"
              style={{ height: "40px", fontSize: "20px" }}
            >
              {data.result.specialTag}
            </span>
          </span>
          <p style={{ fontSize: "20px" }} className="pt-2">
            {data?.result?.description}
          </p>
          <span className="h3">${data.result.price}</span> &nbsp;&nbsp;&nbsp;
          <span
            className="pb-2  p-3"
            style={{ border: "1px solid #333", borderRadius: "30px" }}
          >
            <i
              onClick={() => {
                handleQuantity(-1);
              }}
              className="bi bi-dash p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
            ></i>
            <span className="h3 mt-3 px-3">{quantity}</span>
            <i
              onClick={() => {
                handleQuantity(+1);
              }}
              className="bi bi-plus p-1"
              style={{ fontSize: "25px", cursor: "pointer" }}
            ></i>
          </span>
          <div className="row pt-4">
            <div className="col-5">
              {isAddingToCart ? (
                <button className="btn btn-success form-control">
                  <MiniLoader />
                </button>
              ) : (
                <button
                  className="btn btn-success form-control"
                  onClick={() => handleAddToCart(data.result.id)}
                >
                  Add to Cart
                </button>
              )}
            </div>

            <div className="col-5 ">
              <button
                className="btn btn-secondary form-control"
                onClick={() => navigate(-1)}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <div className="col-5">
          <img
            src={data.result.image}
            width="100%"
            style={{ borderRadius: "50%" }}
            alt="No content"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default MenuItemDetails;
