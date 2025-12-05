import { fetchAllBaseItems, fetchAllCategories, fetchAllFlavours, fetchAllItemOptionMaps, fetchAllItems, fetchAllOrderedItems, fetchAllOrderedItemsOptionMaps, fetchAllOrders, fetchAllRoles, fetchAllSizes, fetchAllTables, fetchAllTenants, fetchAllUsers, fetchAllOptions, fetchAll } from '../utilities/fetchUtility'

export const useFetchUtility = () => {
    return {
        fetchAllBaseItems, fetchAllCategories, fetchAllFlavours, fetchAllItemOptionMaps, fetchAllItems, fetchAllOrderedItems, fetchAllOrderedItemsOptionMaps, fetchAllOrders, fetchAllRoles, fetchAllSizes, fetchAllTables, fetchAllTenants, fetchAllUsers, fetchAllOptions, fetchAll
    }
}