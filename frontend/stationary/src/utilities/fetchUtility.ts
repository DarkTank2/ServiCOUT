import { Service } from "@feathersjs/feathers"
import { BaseItemsQuery, FlavoursQuery, ItemsHaveOptionsQuery, ItemsQuery, OptionQuery, OrderedItemHasOptionQuery, OrderedItemsQuery, OrdersQuery, RolesQuery, ServiceTypes, SizesQuery, TablesQuery, TenantQuery, UserQuery } from "backend"
import { CategoriesQuery } from "backend/lib/services/categories/categories.class"
import { SvcParams } from "feathers-pinia/dist/create-pinia-service"

const { api } = useFeathers()

const MAX_RECORDS_PER_FETCH = 200


// 200 is the max amount of records to be fetched
export const fetchAllBaseItems = async function (query: BaseItemsQuery) {
  let { total: counted } = await api.service('base-items').count({ query })
  const fetch = (query: BaseItemsQuery, _limit: number, _skip?: number) : void => {
    api.service('base-items').find({ query: { ...query, $skip: _skip || 0, $limit: _limit } }).then(({ total, skip, data, limit }) => {
        if (data.length === 0) {
            return
          }
          if (data.length + skip !== total) {
            fetch(query, Math.min(total - data.length - skip, MAX_RECORDS_PER_FETCH), data.length + skip)
          }
    })
  }
  fetch(query, Math.min(counted, MAX_RECORDS_PER_FETCH))
}

export const fetchAllCategories = function (query: CategoriesQuery, _skip?: number) {
    api.service('categories').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllCategories(query, data.length + skip)
          }
    })
}
export const fetchAllFlavours = function (query: FlavoursQuery, _skip?: number) {
    api.service('flavours').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllFlavours(query, data.length + skip)
          }
    })
}
export const fetchAllItems = function (query: ItemsQuery, _skip?: number) {
    api.service('items').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllItems(query, data.length + skip)
          }
    })
}
export const fetchAllItemOptionMaps = function (query: ItemsHaveOptionsQuery, _skip?: number) {
    api.service('items-have-options').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllItemOptionMaps(query, data.length + skip)
          }
    })
}
export const fetchAllOptions = function (query: OptionQuery, _skip?: number) {
    api.service('options').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllOptions(query, data.length + skip)
          }
    })
}
export const fetchAllOrderedItems = function (query: OrderedItemsQuery, _skip?: number) {
    api.service('ordered-items').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllOrderedItems(query, data.length + skip)
          }
    })
}
export const fetchAllOrderedItemsOptionMaps = function (query: OrderedItemHasOptionQuery, _skip?: number) {
    api.service('ordered-items-have-options').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllOrderedItemsOptionMaps(query, data.length + skip)
          }
    })
}
export const fetchAllOrders = function (query: OrdersQuery, _skip?: number) {
    api.service('orders').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllOrders(query, data.length + skip)
          }
    })
}
export const fetchAllRoles = function (query: RolesQuery, _skip?: number) {
    api.service('roles').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllRoles(query, data.length + skip)
          }
    })
}
export const fetchAllSizes = function (query: SizesQuery, _skip?: number) {
    api.service('sizes').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllSizes(query, data.length + skip)
          }
    })
}
export const fetchAllTables = function (query: TablesQuery, _skip?: number) {
    api.service('tables').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllTables(query, data.length + skip)
          }
    })
}
export const fetchAllTenants = function (query: TenantQuery, _skip?: number) {
    api.service('tenants').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllTenants(query, data.length + skip)
          }
    })
}
export const fetchAllUsers = function (query: UserQuery, _skip?: number) {
    api.service('users').find({ query: { ...query, $skip: _skip || 0 } }).then(({ total, skip, data }) => {
        if (data.length === 0) {
            // empty data, thu no data istransferred and there is no more data
            return
          }
          if (data.length + skip !== total) {
            fetchAllUsers(query, data.length + skip)
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