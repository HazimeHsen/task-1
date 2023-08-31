import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ActionsRenderer from "./ActionsRenderer"; // Adjust the import path
import { ColDef } from "ag-grid-community";
import { Posts, Users } from "../../../types";
import { Button, styled } from "@mui/material";
import NewUserDialog from "./NewTagDialog";
export interface Tag {
  id: number;
  name: string;
  posts: Posts[];
}
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
  width: "800px",
});

const Tags: React.FC = () => {
  const [rowData, setRowData] = useState<Tag[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [create, setCreate] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get<Tag[]>(
        "https://localhost:5001/api/Tags"
      );
      setRowData(data);
    };
    getData();
  }, [deleted, edited, create]);

  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Tag Name", field: "name" },
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
          <h1>Tags Table</h1>
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

export default Tags;
