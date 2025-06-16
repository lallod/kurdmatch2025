
import { useState } from 'react';

export const useUserPagination = (initialUsersPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(initialUsersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUsersPerPageChange = (count: number) => {
    setUsersPerPage(count);
    setCurrentPage(1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    usersPerPage,
    handlePageChange,
    handleUsersPerPageChange,
    resetPagination,
    setUsersPerPage: handleUsersPerPageChange
  };
};
