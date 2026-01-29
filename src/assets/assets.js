import cart from "./cart.png";
import cloth from "./cloth.png";
import electronics from "./electronic.png";
import furniture from "./furniture.png";
import beauty from "./beauty.png";
import mobile from "./mobile.png";
import toys from "./toys.png";
import login from "./login.png";
import logo from "./logo.png";
import profile from "./profile.png";
import header from "./header.png";
import delivery from "./delivery.png";

export const assets = {
    header,
    profile,
    login,
    cart,
    logo,
    delivery,
};

export const categories = [{
        id: 1,
        name: "Mobiles",
        key: "mobiles",
        icon: mobile,
    },
    {
        id: 2,
        name: "Electronics",
        key: "electronics",
        icon: electronics,
    },
    {
        id: 3,
        name: "Fashion",
        key: "fashion",
        icon: cloth,
    },
    {
        id: 4,
        name: "Furniture",
        key: "furniture",
        icon: furniture,
    },
    {
        id: 5,
        name: "Beauty",
        key: "beauty",
        icon: beauty,
    },
    {
        id: 6,
        name: "Toys & Games",
        key: "toys",
        icon: toys,
    },
];