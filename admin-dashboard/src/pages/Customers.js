import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/customers/customerSlice";

const columns = [
  {
    title: "Sr. No.",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
];

const Customers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const customerState = useSelector(
    (state) => state.customer.customers.getUsers
  );
  const data = [];
  if (customerState !== undefined) {
    for (let i = 0; i < customerState.length; i++) {
      if (customerState[i].role !== "admin") {
        data.push({
          key: i + 1,
          name: customerState[i].firstname + " " + customerState[i].lastname,
          email: customerState[i].email,
          mobile: customerState[i].mobile,
        });
      }
    }
  }
  return (
    <div>
      <h3 className="mb-4 title">Customers</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default Customers;
