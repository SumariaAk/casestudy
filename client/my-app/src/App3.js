import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css'; // Import the CSS file for styling
import FetchButton from './FetchButton';
import DownloadLink from './DownloadLink';
import SearchInput from './SearchInput';
import FilterSelect from './FilterSelect';
import TableData from './TableData';
import { TableRow, TableCell } from '@material-ui/core';

const fetchData = async (setDownloadUrl) => {
  try {
    const FBASE_BACKEND_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
    const FETCH_DATA_URI = '/fetchdata';
    const FINAL_FETCH_BACKEND_URL = FBASE_BACKEND_URL + FETCH_DATA_URI;
    console.log(FBASE_BACKEND_URL + ' ' + FETCH_DATA_URI + ' ' + FINAL_FETCH_BACKEND_URL);
    const response = await axios.get(FINAL_FETCH_BACKEND_URL);
    // const response = await axios.get('https://7vxvj927kk.execute-api.us-east-1.amazonaws.com/dev/fetchdata');
    setDownloadUrl(response.data);
  } catch (error) {
    console.error(error);
  }
};

const App = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    fetchData(setDownloadUrl);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPageNumber(0); // Reset page number when search query changes
  };

  const handleFilterChange = (event) => {
    setGenderFilter(event.target.value);
    setPageNumber(0); // Reset page number when filter changes
  };

  const filteredData = data.filter((row) => {
    const fullName = `${row.first_name} ${row.last_name}`.toLowerCase();
    const email = row.email.toLowerCase();

    return (
      row.id.toString().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    ) && (genderFilter === '' || row.gender === genderFilter);
  });

  const itemsPerPage = 100;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

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

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDownload = async () => {
    try {
      const GBASE_BACKEND_URL = process.env.REACT_APP_BACKEND_ENDPOINT;
      const GET_DATA_URI = '/getcsv';
      const FINAL_GET_BACKEND_URL = GBASE_BACKEND_URL + GET_DATA_URI;
      console.log(GBASE_BACKEND_URL + ' ' + GET_DATA_URI + ' ' + FINAL_GET_BACKEND_URL);
      const response = await axios.get(FINAL_GET_BACKEND_URL);
      // const response = await axios.get('https://7vxvj927kk.execute-api.us-east-1.amazonaws.com/dev/getcsv');
      setDownloadUrl(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header>
        <FetchButton onClick={handleDownload} />
        {downloadUrl && <DownloadLink downloadUrl={downloadUrl} />}
      </header>
      <div>
        {downloadUrl && (
          <div className="download-container">
            <textarea id="downloadUrl" value={downloadUrl} readOnly />
          </div>
        )}
      </div>
      <div>
        <SearchInput value={searchQuery} onChange={handleSearchChange} />
        <FilterSelect value={genderFilter} onChange={handleFilterChange} />
      </div>
      <div className="content">
        <TableData data={displayData} />
      </div>
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
};

export default App;
