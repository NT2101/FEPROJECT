// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Chức năng',
  type: 'group',
  children: [
   
    {
      id: 'Account',
      title: 'Quản lý Tài khoản',
      type: 'item',
      url: '/account',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Faculty',
      title: 'Quản lý Khoa',
      type: 'item',
      url: '/faculty',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Specialization',
      title: 'Quản lý Chuyên ngành',
      type: 'item',
      url: '/specialization',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Grade',
      title: 'Quản lý Lớp',
      type: 'item',
      url: '/class',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Teacher',
      title: 'Quản lý Giảng viên',
      type: 'item',
      url: '/teacher',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'Student',
      title: 'Quản lý Sinh viên',
      type: 'item',
      url: '/student',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Field',
      title: 'Quản lý Lĩnh vực',
      type: 'item',
      url: '/fields',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'Topic',
      title: 'Quản lý Đề tài',
      type: 'item',
      url: '/topic',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'adminguild',
      title: 'Quản lý hướng dẫn',
      type: 'item',
      url: '/adminguild',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'ChangPassword',
      title: 'Đổi mật khẩu',
      type: 'item',
      url: '/changpassword',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'Committee',
      title: 'Quản lý Hội đồng',
      type: 'item',
      url: '/Committee',
      icon: icons.LoginOutlined,
      role: [3]
    },
    {
      id: 'committeeteacher',
      title: 'Danh sách hội đồng',
      type: 'item',
      url: '/committeeteacher',
      icon: icons.LoginOutlined,
      role: [2]
    },
  
    {
      id: 'teacherguild',
      title: 'Danh sách hướng dẫn',
      type: 'item',
      url: '/teacherguild',
      icon: icons.LoginOutlined,
      role: [2]
    },
    {
      id: 'editteacher',
      title: 'Thay đổi thông tin ',
      type: 'item',
      url: '/editteacher',
      icon: icons.LoginOutlined,
      role: [2]
    },
    {
      id: 'editstudent',
      title: 'Thay đổi thông tin ',
      type: 'item',
      url: '/editstudent',
      icon: icons.LoginOutlined,
      role: [1]
    },
    {
      id: 'studentregister',
      title: 'Đăng ký hướng dẫn',
      type: 'item',
      url: '/studentregister',
      icon: icons.LoginOutlined,
      role: [1]
    },

    
    {
      id: 'submitreport',
      title: 'Báo cáo tiến độ',
      type: 'item',
      url: '/submitreport',
      icon: icons.LoginOutlined,
      role: [1]

    },
    {
      id: 'teacherreview',
      title: 'Xem tiến độ',
      type: 'item',
      url: '/teacherreview',
      icon: icons.LoginOutlined,
      role: [2]

    },
    {
      id: 'manageprogress',
      title: 'Quản lý tiến độ',
      type: 'item',
      url: '/manageprogress',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'topicchange',
      title: 'Thay đổi đề tài',
      type: 'item',
      url: '/topicchange',
      icon: icons.LoginOutlined,
      role: [1]

    }, {
      id: 'teacherappoval',
      title: 'Xác nhận thay đổi đề tài',
      type: 'item',
      url: '/teacherappoval',
      icon: icons.LoginOutlined,
      role: [2]

    },
    {
      id: 'assignstudent',
      title: 'Phân công hướng dẫn',
      type: 'item',
      url: '/assignstudent',
      icon: icons.LoginOutlined,
      role: [3]

    },
    {
      id: 'registertopic',
      title: 'Đăng ký đề tài',
      type: 'item',
      url: '/registertopic',
      icon: icons.LoginOutlined,
      role: [2]

    },
    

  ]
};

export default pages;
