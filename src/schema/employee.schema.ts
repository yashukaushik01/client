import * as Yup from 'yup';

export const employeeAddValidationSchema = Yup.object({
    jobTitle: Yup
      .string()
      .required('Job Title is required'),
    deptId: Yup
      .string()
      .required('Department is required'),
    name: Yup
      .string()
      .required('Required'),
    role: Yup
      .string()
      .required('Role is required'),
    dateOfBirth: Yup
      .date()
      .required('Birth Date is required'),
    address: Yup.object({
        houseNo: Yup.string().required('House No is required'),
        area: Yup.string().required('Area is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        phone: Yup.number().required('Phone is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    password: Yup
      .string()
      .required('Password is required'),
    allotedLeaves: Yup
      .number()
      .required('Alloted Leaves is required')
})

export interface IEmployeeInitialValues{
  jobTitle: string;
  deptId: string;
  name: string;
  role: string;
  dateOfBirth:string;
  address: {
    houseNo: string;
    area: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  }
  password: string;
  allotedLeaves: string;
}

