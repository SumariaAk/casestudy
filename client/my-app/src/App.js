import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactPaginate from 'react-paginate';
import './App.css'; // Import the CSS file for styling

const useStyles = makeStyles({
  searchInput: {
    marginBottom: 20,
  },
  filterSelect: {
    minWidth: 120,
    marginLeft: 10,
  },
});

function App() {
  const classes = useStyles();
  const [data, setData] = useState([]); // State to store the fetched data
  const [pageNumber, setPageNumber] = useState(0); // State to track the current page number
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [genderFilter, setGenderFilter] = useState(''); // State for the gender filter
  const [downloadUrl, setDownloadUrl] = useState(''); // State for the download URL

  // Fetch data from the backend API
  const fetchData = async () => {
    try {
      const FBASE_BACKEND_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
      const FETCH_DATA_URI = '/fetchdata';
      const FINAL_FETCH_BACKEND_URL = FBASE_BACKEND_URL + FETCH_DATA_URI;
      const response = await axios.get(FINAL_FETCH_BACKEND_URL);
      setData(response.data); // Update the data state with the fetched data
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const itemsPerPage = 100; // Number of items to display per page
  const pagesVisited = pageNumber * itemsPerPage; // Calculate the index of the first item to display on the current page
  const pageCount = Math.ceil(data.length / itemsPerPage); // Calculate the total number of pages

  // Event handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPageNumber(0); // Reset page number when search query changes
  };

  // Event handler for gender filter select change
  const handleFilterChange = (event) => {
    setGenderFilter(event.target.value);
    setPageNumber(0); // Reset page number when filter changes
  };

  // Filter the data based on the search query and gender filter
  const filteredData = data.filter((row) => {
    const fullName = `${row.first_name} ${row.last_name}`.toLowerCase();
    const email = row.email.toLowerCase();
  
    return (
      row.id.toString().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    ) && (genderFilter === '' || row.gender === genderFilter);
  });

  // Display the data for the current page
  const displayData = filteredData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.first_name}</TableCell>
        <TableCell>{item.last_name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.gender}</TableCell>
        <TableCell>{item.ip_address}</TableCell>
      </TableRow>
    ));

  // Event handler for page change
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  // Event handler for the download button
  const handleDownload = async () => {
    try {
      const GBASE_BACKEND_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
      const GET_DATA_URI = '/getcsv';
      const FINAL_GET_BACKEND_URL = GBASE_BACKEND_URL + GET_DATA_URI;
      console.log(GBASE_BACKEND_URL + ' ' + GET_DATA_URI + ' ' + FINAL_GET_BACKEND_URL);
      const response = await axios.get(FINAL_GET_BACKEND_URL);
      const temp = response.data;
      setDownloadUrl(temp); // Update the download URL state with the fetched URL
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header>
        <button onClick={handleDownload}>Download</button>
        {downloadUrl && (
          <p>
            Download URL:{' '}
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </p>
        )}
      </header>
      <div>
        {downloadUrl && (
          <div className="download-container">
            <textarea id="downloadUrl" value={downloadUrl} readOnly />
          </div>
        )}
      </div>
      <div>
        <TextField
          className={classes.searchInput}
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FormControl variant="outlined" className={classes.filterSelect}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={genderFilter}
            onChange={handleFilterChange}
            label="Gender"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="content">
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
          <TableBody>{displayData}</TableBody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        previousLabel="< Previous"
        nextLabel="Next >"
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        pageLinkClassName='page-num'
        previousClassName='page-num'
        nextLinkClassName='page-num'
        activeLinkClassName='active'
        forcePage={pageNumber}
      />
    </div>
  );
}

export default App;

