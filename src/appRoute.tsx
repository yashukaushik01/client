import { Routes, Route } from "react-router-dom"
import AddEmployeeForm from "./components/AddEmployeeForm";
import AddLeave from "./components/AddLeave";
import AdminMain from "./components/AdminMain";
import EmployeeMain from "./components/EmployeeMain";
import EmployeeTable from "./components/EmployeeTable";
import LeaveTable from "./components/LeaveTable";
import LoginForm from "./components/LoginForm";

        const AppRoute = () => {        
        
        return(
        <Routes>
              <Route path="/login" element = {<LoginForm />} />

                  <Route path="/admin" element = {<AdminMain />}>
                    <Route path="view-employees/" element = {<EmployeeTable />} />
                    <Route path="view-employee/:email" element = {<AddEmployeeForm />} />
                    <Route path="add-employee" element = {<AddEmployeeForm />} />
                    <Route path="view-leaves" element = {<LeaveTable />} />
                  </Route>

                  <Route path="/employee" element={<EmployeeMain />}>
                    <Route path="home" element = {<AddEmployeeForm />} />
                    <Route path="add-leave" element = {<AddLeave />} />
                    <Route path="view-leaves" element = {<LeaveTable />} />
                  </Route>

          </Routes>
          )}

          export {AppRoute};