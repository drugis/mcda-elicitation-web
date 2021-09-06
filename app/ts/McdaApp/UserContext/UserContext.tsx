import IUser from '@shared/interface/User/IUser';
import Cookies from 'js-cookie';
import {createContext} from 'react';
import IUserContext from './IUserContext';

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserContextProviderComponent({children}: {children: any}) {
  const user: IUser = JSON.parse(Cookies.get('LOGGED-IN-USER'));

  return (
    <UserContext.Provider
      value={{
        userId: user.id,
        userName: `${user.firstname} ${user.lastname}`
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
