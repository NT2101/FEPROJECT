// Project imports
import pages from './pages';

// ==============================|| MENU ITEMS ||============================== //

const getUserRoleID = () => {
  const userDataStr = localStorage.getItem('User');
  if (userDataStr) {
    const userData = JSON.parse(userDataStr);
    if (userData && userData.account && userData.account.roleID) {
      return userData.account.roleID;
    }
  }
  return null;
};

const userRoleID = getUserRoleID();

const filteredPages = pages.children.filter((item) => {
  if (item.role && userRoleID) {
    return item.role.includes(userRoleID);
  }
  return false;
});

pages.children = filteredPages;

const menuItems = {
  items: [ pages]
};

export default menuItems;
