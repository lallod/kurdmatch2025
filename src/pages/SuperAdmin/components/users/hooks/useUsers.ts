
import { useEffect } from 'react';
import { useUserData } from './useUserData';
import { useUserStats } from './useUserStats';
import { useUserFilters } from './useUserFilters';
import { useUserPagination } from './useUserPagination';

export const useUsers = (initialUsersPerPage: number = 10) => {
  const {
    users,
    loading,
    totalUsers,
    databaseVerified,
    fetchUsers,
    setDatabaseVerified
  } = useUserData();

  const userStats = useUserStats(totalUsers, databaseVerified);

  const {
    searchTerm,
    statusFilter,
    roleFilter,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    applyFilters
  } = useUserFilters();

  const {
    currentPage,
    usersPerPage,
    handlePageChange,
    handleUsersPerPageChange,
    resetPagination
  } = useUserPagination(initialUsersPerPage);

  useEffect(() => {
    fetchUsers(currentPage, usersPerPage);
  }, [currentPage, usersPerPage]);

  const filteredUsers = applyFilters(users);

  const handleRefresh = () => {
    resetPagination();
    setDatabaseVerified(false);
    fetchUsers(1, usersPerPage);
  };

  return {
    users,
    filteredUsers,
    loading,
    currentPage,
    totalUsers,
    userStats,
    searchTerm,
    statusFilter,
    roleFilter,
    usersPerPage,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setUsersPerPage: handleUsersPerPageChange,
    handlePageChange,
    handleRefresh,
    fetchUsers: () => fetchUsers(currentPage, usersPerPage)
  };
};
