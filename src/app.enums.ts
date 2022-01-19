export enum statusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    Unprocessable_Entity = 422,
    NOT_FOUND = 404
}

export enum Role {
    EMPLOYEE = 'employee',
    ADMIN = 'admin' 
}

export enum LeaveStatus {
    REQUESTED = 'Requested',
    APPROVED = 'Approved',
    DECLINED = 'Declined'
}