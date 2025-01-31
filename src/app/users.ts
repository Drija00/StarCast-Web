export interface User{
    userId: string;
    username:string;
    firstname:string;
    lastname:string;
    description:string;
    date:Date;
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
        background_img: "https://cdn.pixabay.com/photo/2017/06/14/08/20/map-of-the-world-2401458_960_720.jpg",
        firstname: "Ivan",
        lastname: "Ristić",
        date: new Date('2022-12-14'),
        description: "Big Boss"
    },
    {
        userId: "06e49738-f9e0-4741-8926-d20d756400f7",
        username: "andrijama",
        email: "andrijama@telekom.rs",
        password: "andrijama",
        active: true,
        profile_img: "https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_1280.png",
        background_img: "https://cdn.pixabay.com/photo/2022/06/21/23/02/background-7276646_1280.jpg",
        firstname: "Andrija",
        lastname: "Marić",
        date: new Date('2021-10-14'),
        description: "Karate Kid"
    },
    {
        userId: "cdd963a4-8edb-471c-8b42-8de16ca64241",
        username: "tamarat",
        email: "tamarat@telekom.rs",
        password: "tamarat",
        active: false,
        profile_img: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_1280.png",
        background_img: "https://cdn.pixabay.com/photo/2021/01/05/06/40/boat-5889919_1280.png",
        firstname: "Tamara",
        lastname: "Radivojević",
        date: new Date('2023-05-14'),
        description: "UA GROBARI"
    }
]