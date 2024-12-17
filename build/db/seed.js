"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const TESTIMONIALS = [
    {
        id: 1,
        name: "John Doe",
        image: "https://i.pravatar.cc/350?img=1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 2,
        name: "Syed Saad",
        image: "https://i.pravatar.cc/350?img=2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 3,
        name: "Dawood Ahmed",
        image: "https://i.pravatar.cc/350?img=3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 4,
        name: "Syed Saad",
        image: "https://i.pravatar.cc/350?img=4",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 5,
        name: "Marry Doe",
        image: "https://i.pravatar.cc/350?img=1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 6,
        name: "Taha Khan",
        image: "https://i.pravatar.cc/350?img=2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 7,
        name: "Sasuke Uchiha",
        image: "https://i.pravatar.cc/350?img=3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 8,
        name: "Naruto Uzumaki",
        image: "https://i.pravatar.cc/350?img=4",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 9,
        name: "Sakura Haruno",
        image: "https://i.pravatar.cc/350?img=1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 10,
        name: "Madara Uchiha",
        image: "https://i.pravatar.cc/350?img=2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 11,
        name: "Nagato Uzumaki",
        image: "https://i.pravatar.cc/350?img=3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 12,
        name: "Itachi Uchiha",
        image: "https://i.pravatar.cc/350?img=4",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 13,
        name: "Sunade Senju",
        image: "https://i.pravatar.cc/350?img=1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 14,
        name: "Hashirama Senju",
        image: "https://i.pravatar.cc/350?img=2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 15,
        name: "Tobirama Senju",
        image: "https://i.pravatar.cc/350?img=3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 16,
        name: "Jiraiya Senju",
        image: "https://i.pravatar.cc/350?img=4",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 17,
        name: "Hinata Hyuga",
        image: "https://i.pravatar.cc/350?img=1",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
    {
        id: 18,
        name: "Neji Hyuga",
        image: "https://i.pravatar.cc/350?img=2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
    },
];
const adminSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield prisma.user.create({
            data: {
                first_name: "Super",
                last_name: "Admin",
                email: "admin@admin.com",
                password: yield bcrypt_1.default.hash("Admingghg@1", 10),
                role: "ADMIN",
                email_verified_at: new Date(),
                is_active: true,
            },
        });
        console.log("==================== Admin SEEDING SUCCESS =================== : ", admin);
    }
    catch (error) {
        console.log("==================== Admin SEEDING ERROR =================== : ", error);
    }
});
const homePageSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const homeData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const home = yield tx.home.upsert({
                update: {
                    title: "We Are A Scholarship Agency That Thinks Differently",
                },
                where: {
                    id: 1,
                },
                create: {
                    title: "We Are A Scholarship Agency That Thinks Differently",
                },
            });
            let testimonials = [];
            TESTIMONIALS.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield tx.testimonials.create({
                    data: {
                        name: item.name,
                        description: item.description,
                        image: {
                            create: {
                                url: item.image,
                                is_active: true,
                            },
                        },
                    },
                });
                testimonials.push(data);
            }));
            return {
                home,
                testimonials,
            };
        }));
        console.log("==================== Home SEEDING SUCCESS =================== : ", homeData);
    }
    catch (error) {
        console.log("==================== Home SEEDING ERROR =================== : ", error);
    }
});
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await adminSeed().catch(() => {});
        yield homePageSeed();
    }
    catch (error) { }
});
seed();
