export interface CreateUserDTO {
    email: string
    password: string
    name?: string
    lastName?: string
}

export interface UpdateUserDTO {
    email?: string
    password?: string
    name?: string
    lastName?: string
}