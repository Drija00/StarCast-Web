export interface User{
    userId: string;
    username:string;
    email:string;
    password:string;
    profile_img:string;
    background_img:string;
    active: boolean;
    
}

export const users:User[] = [
    {
        userId: "1ed32ee2-59d4-44e1-b1e4-234901aa51f2",
        username: "ivanri",
        email: "ivanri@telekom.rs",
        password: "ivanri",
        active: true,
        profile_img: "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png",
        background_img: ""
    },
    {
        userId: "06e49738-f9e0-4741-8926-d20d756400f7",
        username: "andrijama",
        email: "andrijama@telekom.rs",
        password: "andrijama",
        active: true,
        profile_img: "https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_1280.png",
        background_img: ""
    },
    {
        userId: "cdd963a4-8edb-471c-8b42-8de16ca64241",
        username: "tamarat",
        email: "tamarat@telekom.rs",
        password: "tamarat",
        active: true,
        profile_img: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_1280.png",
        background_img: ""
    }
]