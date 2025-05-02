import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMenuItemsQuery } from "../../../apis/menuItemApi";
import { menuItemModel } from "../../../Interfaces";
import { setMenuItem } from "../../../Storage/Redux/MenuItemSlice";
import MenuItemCard from "./MenuItemCard";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/Redux/store";
import { SD_SortTypes } from "../../../Utility/SD";

function MenuItemList() {
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMenuItemsQuery(null);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];

  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFilters(
        sortName,
        selectedCategories,
        searchValue
      );
      setMenuItems(tempMenuArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.result));
      setMenuItems(data.result);

      const tempCategoryList = ["All"];
      data.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategories,
      searchValue
    );
    setMenuItems(tempArray);
  };

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategories(localCategory);
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setMenuItems(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
  };

  const handleFilters = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    let tempArray =
      category === "All"
        ? [...data.result]
        : data.result.filter(
            (item: menuItemModel) =>
              item.category.toUpperCase() === category.toUpperCase()
          );

    //search funtionality
    if (search) {
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item: menuItemModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    //sort
    if (sortType === SD_SortTypes.PRICE_LOW_HIGH) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => a.price - b.price);
    }
    if (sortType === SD_SortTypes.PRICE_HIGH_LOW) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => b.price - a.price);
    }
    if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort(
        (a: menuItemModel, b: menuItemModel) =>
          a.name.toUpperCase().charCodeAt(0) -
          b.name.toUpperCase().charCodeAt(0)
      );
    }

    return tempArray;
  };

  if (isLoading) {
    return (
      <div>
        <MainLoader />
      </div>
    );
  }

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li
              className="nav-tem"
              style={{ ...(index === 0 && { marginLeft: "auto" }) }}
              key={index}
            >
              <button
                onClick={() => handleCategoryClick(index)}
                className={`nav-link p-0pb-0 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li
            className="nav-item dropdown"
            style={{
              marginLeft: "auto",
            }}
          >
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  className="dropdown-item"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSortClick(index)}
                >
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      {menuItems.length > 0 &&
        menuItems.map((menuItem: menuItemModel, index: number) => (
          <MenuItemCard menuItem={menuItem} key={index} />
        ))}
    </div>
  );
}

export default MenuItemList;
