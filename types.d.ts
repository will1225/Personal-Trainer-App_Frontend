export interface UserAccountProps {
    id: number,
    email: string,
    profile?: ProfileProps,
    otp?: OTPProps,
    verified: boolean,
    provider?: string,
    createdAt: Date,
    updatedAt?: Date
}

export interface ProfileProps {
    id: number,
    userAccount?: UserAccountProps,
    userId: number,
    firstName: string,
    lastName: string,
    dob?: Date,
    gender?: string,
    initBodyMeasurement?: BodyMeasurementProps,
    bodyMeasurementId?: number,
    createdAt: Date,
    updatedAt?: Date
}

export interface OTPProps {
    id: number,
    otp: string,
    userId: number,
    userAccount: UserAccountProps,
    createdAt: Date,
    updatedAt?: Date
}

export interface BodyMeasurementProps {
    id: number,
    weight: number,
    chest?: number,
    abdomen?: number,
    thigh?: number,
    bypassMeasurementFlag: boolean,
    bodyFatPercent: number,
    muscleMass: number,
    profile?: ProfileProps,
    date: Date
}