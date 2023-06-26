import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

const TableData = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>IP Address</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{data}</TableBody>
    </Table>
  );
};

export default TableData;
