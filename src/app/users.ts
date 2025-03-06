export interface User{
    userId: string;
    username:string;
    email:string;
    password:string;
    active: boolean;
    firstName:string;
    lastName:string;
    joinDate:Date;
    description:string;
    profileImage:string;
    backgroundImage:string;
    following: UserFollowing[]
    followers: UserFollowing[]
}
export interface UserFollowing{
    userId: string;
    username:string;
    firstName:string;
    lastName:string;
    profileImage:string;
}
export interface SetProfileResponse{
    profileImage:string;
}
export interface SetBackgroundImage{
    backgroundImage:string;
}
export interface SetDescription{
    description:string;
}
export interface Users{
    items:User[]
}

export const users:User[] = [
    /*{
        userId: "1ed32ee2-59d4-44e1-b1e4-234901aa51f2",
        username: "ivanri",
        email: "ivanri@telekom.rs",
        password: "ivanri",
        active: true,
        profileImage: "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png",
        backgroundImage: "https://cdn.pixabay.com/photo/2017/06/14/08/20/map-of-the-world-2401458_960_720.jpg",
        firstName: "Ivan",
        lastName: "Ristić",
        joinDate: new Date('2022-12-14'),
        description: "Big Boss",
        following:[],
        followers:[]
    },
    {
        userId: "6334bfac-30b3-43c3-b6c4-1aee30a9f319",
        username: "andrijama",
        email: "andrijama@telekom.rs",
        password: "andrijama",
        active: true,
        profileImage: "https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_1280.png",
        backgroundImage: "https://cdn.pixabay.com/photo/2022/06/21/23/02/background-7276646_1280.jpg",
        firstName: "Andrija",
        lastName: "Marić",
        joinDate: new Date('2021-10-14'),
        description: "Karate Kid",
        following:[],
        followers:[]
    },
    {
        userId: "cdd963a4-8edb-471c-8b42-8de16ca64241",
        username: "tamarat",
        email: "tamarat@telekom.rs",
        password: "tamarat",
        active: false,
        profileImage: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_1280.png",
        backgroundImage: "https://cdn.pixabay.com/photo/2021/01/05/06/40/boat-5889919_1280.png",
        firstName: "Tamara",
        lastName: "Radivojević",
        joinDate: new Date('2023-05-14'),
        description: "UA GROBARI",
        following:[],
        followers:[]
    }*/
]