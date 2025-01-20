import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const TESTIMONIALS = [
  {
    id: 1,
    name: "John Doe",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 2,
    name: "Syed Saad",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 3,
    name: "Dawood Ahmed",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 4,
    name: "Syed Saad",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },

  {
    id: 5,
    name: "Marry Doe",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 6,
    name: "Taha Khan",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 7,
    name: "Sasuke Uchiha",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 8,
    name: "Naruto Uzumaki",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 9,
    name: "Sakura Haruno",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 10,
    name: "Madara Uchiha",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 11,
    name: "Nagato Uzumaki",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 12,
    name: "Itachi Uchiha",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 13,
    name: "Sunade Senju",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 14,
    name: "Hashirama Senju",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 15,
    name: "Tobirama Senju",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 16,
    name: "Jiraiya Senju",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 17,
    name: "Hinata Hyuga",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
  {
    id: 18,
    name: "Neji Hyuga",
    image: "/images/testimonial.webp",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, repellat.",
  },
];

const adminSeed = async () => {
  try {
    const admin = await prisma.user.create({
      data: {
        first_name: "Super",
        last_name: "Admin",
        email: "admin@admin.com",
        password: await bcrypt.hash("Admingghg@1", 10),
        role: "ADMIN",
        email_verified_at: new Date(),
        is_active: true,
      },
    });
    console.log(
      "==================== Admin SEEDING SUCCESS =================== : ",
      admin
    );
  } catch (error) {
    console.log(
      "==================== Admin SEEDING ERROR =================== : ",
      error
    );
  }
};

const homePageSeed = async () => {
  try {
    const homeData = await prisma.$transaction(async (tx) => {
      const home = await tx.home.upsert({
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

      const testimonials = await tx.testimonials.create({
        data: {
          name: TESTIMONIALS[0].name,
          description: TESTIMONIALS[0].description,
          image: {
            create: {
              url: TESTIMONIALS[0].image,
              is_active: true,
            },
          },
        },
      });

      return {
        home,
        testimonials: [testimonials],
      };
    });
    console.log(
      "==================== Home SEEDING SUCCESS =================== : ",
      homeData
    );
  } catch (error) {
    console.log(
      "==================== Home SEEDING ERROR =================== : ",
      error
    );
  }
};

const addTestimonials = async () => {
  try {
    TESTIMONIALS.forEach(async (item) => {
      await prisma.testimonials.create({
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
    });
  } catch (error) {
    console.log("error", error);
  }
};

// adminSeed()
//   .catch(() => {})
//   .finally(async () => {
//     await addTestimonials();
//     await homePageSeed();
//     console.log("==================== SEEDING DONE ===================");
//   });
homePageSeed();
