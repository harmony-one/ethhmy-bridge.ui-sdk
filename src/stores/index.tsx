import { Exchange } from './Exchange'
import { createStoresContext } from './create-context'
import { UserStoreEx } from './UserStore';
import { UserStoreMetamask } from './UserStoreMetamask';

export interface IStores {
  exchange?: Exchange;
  user?: UserStoreEx;
  userMetamask?: UserStoreMetamask;
}

const stores: IStores = {}

stores.exchange = new Exchange(stores)
stores.user = new UserStoreEx(stores);
stores.userMetamask = new UserStoreMetamask(stores);

if (!process.env.production) {
  // @ts-ignore
  window.stores = stores
}

const { StoresProvider, useStores } = createStoresContext<typeof stores>()
export { StoresProvider, useStores }

export default stores
