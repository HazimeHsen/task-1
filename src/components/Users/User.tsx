import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ActionsRenderer from "./ActionsRenderer"; // Adjust the import path
import { ColDef } from "ag-grid-community";
import { Users } from "../../../types";
import { Button, styled } from "@mui/material";
import NewUserDialog from "./NewUserDialog";

const Container = styled("div")({
  textAlign: "center",
  marginTop: "20px",
  paddingInline: "30px",
});

const GridContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const AgGridContainer = styled("div")({
  height: 400,
  maxWidth: "100%",
  width: "1000px",
});

const User: React.FC = () => {
  const [rowData, setRowData] = useState<Users[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [create, setCreate] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get<Users[]>(
        "https://localhost:5001/api/Users"
      );
      setRowData(data);
    };
    getData();
  }, [deleted, edited, create]);

  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Username", field: "username" },
    { headerName: "Email", field: "email" },
    {
      headerName: "Number of Posts",
      valueGetter: (params: any) => (params.data.posts || []).length,
    },
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <ActionsRenderer
          edited={edited}
          setEdited={setEdited}
          deleted={deleted}
          setDeleted={setDeleted}
          value={params.data}
        />
      ),
    },
  ] as ColDef<any, any>[];

  return (
    <Container>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <h1>Users Table</h1>
          <NewUserDialog create={create} setCreate={setCreate} />
        </div>
      </div>
      <GridContainer>
        <AgGridContainer className="ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
          />
        </AgGridContainer>
      </GridContainer>
    </Container>
  );
};

export default User;
