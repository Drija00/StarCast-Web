export interface User{
    id: number;
    username:string;
    email:string;
    password:string;
}

export const users:User[] = [
    {
        id: 1,
        username: "ivanri",
        email: "ivanri@telekom.rs",
        password: "ivanri"
    },
    {
        id: 2,
        username: "andrijama",
        email: "andrijama@telekom.rs",
        password: "andrijama"
    },
    {
        id: 3,
        username: "tamarat",
        email: "tamarat@telekom.rs",
        password: "tamarat"
    }
]