import * as Yup from 'yup';

export const leaveAddValidationSchema = Yup.object({
    fromDate: Yup
        .date()
        .required('From Date is required'),
    toDate: Yup
        .date()
        .required('To Date is required'),
    reason: Yup
        .string()
        .required('Required'),
}) 

// export 