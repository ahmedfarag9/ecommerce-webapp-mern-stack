import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getCategories } from "../features/productCategory/productCategorySlice";

const columns = [
  {
    title: "Sr. No.",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const productCategoryState = useSelector(
    (state) => state.productCategory.productCategories.categories
  );
  const data = [];
  if (productCategoryState !== undefined) {
    for (let i = 0; i < productCategoryState.length; i++) {
      data.push({
        key: i + 1,
        name: productCategoryState[i].title,
        action: (
          <>
            <Link className="fs-3 text-danger" to="/">
              <BiEdit />
            </Link>
            <Link className="ms-3 fs-3 text-danger" to="/">
              <AiFillDelete />
            </Link>
          </>
        ),
      });
    }
  }

  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default Categorylist;
