/* eslint-disable no-unused-vars */
import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - login demo
// const LoginPageDemo = Loadable(lazy(() => import('pages/authentication/LoginForm/index')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

const Faculty = Loadable(lazy(() => import('pages/faculty')));
const Class = Loadable(lazy(() => import('pages/class')));
const Specialization = Loadable(lazy(() => import('pages/specialization')));
const Teacher = Loadable(lazy(() => import('pages/teacher')));
const Student = Loadable(lazy(() => import('pages/student')));
const Account = Loadable(lazy(() => import('pages/account')));
const Fields = Loadable(lazy(() => import('pages/field')));
const ChangePassword = Loadable(lazy(() => import('pages/changepassword')));
const StudentRegistrationPage = Loadable(lazy(() => import('pages/StudentRegistrationPage/index.js')));
const TeacherDashboardPage = Loadable(lazy(() => import('pages/TeacherGuild/index.js')));
const Committee = Loadable(lazy(() => import('pages/committee/index.js')));
const CommitteeTeacher = Loadable(lazy(() => import('pages/committeeteacher/index')));
const EditTeacher = Loadable(lazy(() => import('pages/editteacher/index')));
const EditStudent = Loadable(lazy(() => import('pages/editstudent/index')));
const AdminGuild = Loadable(lazy(() => import('pages/adminguild/index')));
const ViewReports = Loadable(lazy(() => import('pages/viewreports/index')));
const ManageProgress = Loadable(lazy(() => import('pages/manageprogress/index')));
const SubmitReport = Loadable(lazy(() => import('pages/submitreport/index')));
const TeacherReview = Loadable(lazy(() => import('pages/teacherreview/index')));
const Topic = Loadable(lazy(() => import('pages/topic/index')));
const TopicChange = Loadable(lazy(() => import('pages/topicchangerequest/index')));
const TeacherApproval = Loadable(lazy(() => import('pages/teacherrequestapproval/index')));
const AssignStudentAndTeacher = Loadable(lazy(() => import('pages/assignstudent/index')));
const RegisterTopicForm = Loadable(lazy(() => import('pages/registertopicteacher/index')));





// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
   
    {
      path: '/account',
      element: (
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      )
    },  {
      path: '/registertopic',
      element: (
        <ProtectedRoute>
          <RegisterTopicForm />
        </ProtectedRoute>
      )
    },
    {
      path: '/topicchange',
      element: (
        <ProtectedRoute>
          <TopicChange />
        </ProtectedRoute>
      )
    },
    {
      path: '/assignstudent',
      element: (
        <ProtectedRoute>
          <AssignStudentAndTeacher />
        </ProtectedRoute>
      )
    },
    
    {
      path: '/teacherappoval',
      element: (
        <ProtectedRoute>
          <TeacherApproval />
        </ProtectedRoute>
      )
    },
    {
      path: '/adminguild',
      element: (
        <ProtectedRoute>
          <AdminGuild />
        </ProtectedRoute>
      )
    },
    {
      path: '/faculty',
      element: (
        <ProtectedRoute>
          <Faculty />
        </ProtectedRoute>
      )
    },  
    {
      path: '/topic',
      element: (
        <ProtectedRoute>
          <Topic />
        </ProtectedRoute>
      )
    },  
    {
      path: '/committeeteacher',
      element: (
        <ProtectedRoute>
          <CommitteeTeacher />
        </ProtectedRoute>
      )
    },  
    {
      path: '/committee',
      element: (
        <ProtectedRoute>
          <Committee />
        </ProtectedRoute>
      )
    },  
   
    {
      path: '/viewreport',
      element: (
        <ProtectedRoute>
          <ViewReports />
        </ProtectedRoute>
      )
    },    {
      path: '/teacherreview',
      element: (
        <ProtectedRoute>
          <TeacherReview />
        </ProtectedRoute>
      )
    },
    {
      path: '/manageprogress',
      element: (
        <ProtectedRoute>
          <ManageProgress />
        </ProtectedRoute>
      )
    },
    {
      path: '/submitreport',
      element: (
        <ProtectedRoute>
          <SubmitReport />
        </ProtectedRoute>
      )
    },
    {
      path: '/studentregister',
      element: (
        <ProtectedRoute>
          <StudentRegistrationPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/teacherguild',
      element: (
        <ProtectedRoute>
          <TeacherDashboardPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/specialization',
      element: (
        <ProtectedRoute>
          <Specialization />
        </ProtectedRoute>
      )
    },
    {
      path: '/editteacher',
      element: (
        <ProtectedRoute>
          <EditTeacher />
        </ProtectedRoute>
      )
    },
    {
      path: '/editstudent',
      element: (
        <ProtectedRoute>
          <EditStudent />
        </ProtectedRoute>
      )
    },
    {
      path: '/class',
      element: (
        <ProtectedRoute>
          <Class />
        </ProtectedRoute>
      )
    },
    {
      path: '/teacher',
      element: (
        <ProtectedRoute>
          <Teacher />
        </ProtectedRoute>
      )
    }, {
      path: '/student',
      element: (
        <ProtectedRoute>
          <Student />
        </ProtectedRoute>
      )
    },
    {
      path: '/fields',
      element: (
        <ProtectedRoute>
          <Fields />
        </ProtectedRoute>
      )
    },
    {
      path: '/changpassword',
      element: (
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      )
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    {
      path: 'icons/Account',
      element: <Account />
    }
  ]
};

export default MainRoutes;
