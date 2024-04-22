import { Service } from "@feathersjs/feathers"
import { BaseItemsQuery, FlavoursQuery, ItemsHaveOptionsQuery, ItemsQuery, OptionQuery, OrderedItemHasOptionQuery, OrderedItemsQuery, OrdersQuery, RolesQuery, ServiceTypes, SizesQuery, TablesQuery, TenantQuery, UserQuery } from "backend"
import { CategoriesQuery } from "backend/lib/services/categories/categories.class"
import { SvcParams } from "feathers-pinia/dist/create-pinia-service"

const { api } = useFeathers()

const MAX_RECORDS_PER_FETCH = 200


// 200 is the max amount of records to be fetched
export const fetchAllBaseItems = async function (query: BaseItemsQuery) {
  let { total: counted } = await api.service('base-items').count({ query })
  const fetch = async (query: BaseItemsQuery, _limit: number, _skip?: number) : Promise<void> => {
    await api.service('base-items').find({ query: { ...query, $skip: _skip || 0, $limit: _limit } }).then(async ({ total, skip, data, limit }) => {
        if (data.length === 0) {
            return
          }
          if (data.length + skip !== total) {
            await fetch(query, Math.min(total - data.length - skip, MAX_RECORDS_PER_FETCH), data.length + skip)
          }
    })
  }
  await fetch(query, Math.min(counted, MAX_RECORDS_PER_FETCH))
}

export const fetchAllCategories = async function (query: CategoriesQuery, _skip?: number) {
    await api.service('categories').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllCategories(query, data.length + skip)
          }
    })
}
export const fetchAllFlavours = async function (query: FlavoursQuery, _skip?: number) {
    await api.service('flavours').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllFlavours(query, data.length + skip)
          }
    })
}
export const fetchAllItems = async function (query: ItemsQuery, _skip?: number) {
    await api.service('items').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllItems(query, data.length + skip)
          }
    })
}
export const fetchAllItemOptionMaps = async function (query: ItemsHaveOptionsQuery, _skip?: number) {
    await api.service('items-have-options').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllItemOptionMaps(query, data.length + skip)
          }
    })
}
export const fetchAllOptions = async function (query: OptionQuery, _skip?: number) {
    await api.service('options').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllOptions(query, data.length + skip)
          }
    })
}
export const fetchAllOrderedItems = async function (query: OrderedItemsQuery, _skip?: number) {
    await api.service('ordered-items').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllOrderedItems(query, data.length + skip)
          }
    })
}
export const fetchAllOrderedItemsOptionMaps = async function (query: OrderedItemHasOptionQuery, _skip?: number) {
    await api.service('ordered-items-have-options').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllOrderedItemsOptionMaps(query, data.length + skip)
          }
    })
}
export const fetchAllOrders = async function (query: OrdersQuery, _skip?: number) {
    await api.service('orders').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllOrders(query, data.length + skip)
          }
    })
}
export const fetchAllRoles = async function (query: RolesQuery, _skip?: number) {
    await api.service('roles').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllRoles(query, data.length + skip)
          }
    })
}
export const fetchAllSizes = async function (query: SizesQuery, _skip?: number) {
    await api.service('sizes').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllSizes(query, data.length + skip)
          }
    })
}
export const fetchAllTables = async function (query: TablesQuery, _skip?: number) {
    await api.service('tables').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllTables(query, data.length + skip)
          }
    })
}
export const fetchAllTenants = async function (query: TenantQuery, _skip?: number) {
    await api.service('tenants').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllTenants(query, data.length + skip)
          }
    })
}
export const fetchAllUsers = async function (query: UserQuery, _skip?: number) {
    await api.service('users').find({ query: { ...query, $skip: _skip || 0 } }).then(async ({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            await fetchAllUsers(query, data.length + skip)
          }
    })
}

export const fetchAll = function () {
    fetchAllBaseItems({})
    fetchAllCategories({})
    fetchAllFlavours({})
    fetchAllItemOptionMaps({})
    fetchAllItems({})
    fetchAllOrderedItems({})
    fetchAllOrderedItemsOptionMaps({})
    fetchAllOrders({})
    fetchAllRoles({})
    fetchAllSizes({})
    fetchAllTables({})
    fetchAllTenants({})
    fetchAllUsers({})
    fetchAllOptions({})
}