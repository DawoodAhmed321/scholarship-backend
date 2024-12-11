import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

//   try {
//     const user = await prisma.user.create({
//       data: {
//         first_name: "John",
//         last_name: "Doe",
//         email: "2x8I7@example.com",
//         password: await bcrypt.hash("12345678", 10),
//       },
//     });
//     console.log(
//       "==================== SEEDING User SUCCESS =================== : ",
//       user
//     );
//     const option1 = await prisma.option.create({
//       data: {
//         name: "Gold",
//         price: 10,
//         out_of_stock: false,
//         is_active: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     const option2 = await prisma.option.create({
//       data: {
//         name: "Silver",
//         price: 10,
//         out_of_stock: false,
//         is_active: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });
//     console.log(
//       "==================== SEEDING Option SUCCESS =================== : ",
//       option1,
//       option2
//     );

//     const attribute1 = await prisma.attribute.create({
//       data: {
//         name: "Material",
//         attribute_type: "radio",
//         is_active: true,
//         options: {
//           connect: [
//             {
//               id: option1.id,
//             },
//             {
//               id: option2.id,
//             },
//           ],
//         },
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     const attribute2 = await prisma.attribute.create({
//       data: {
//         name: "Color",
//         attribute_type: "checkbox",
//         is_active: true,
//         options: {
//           connect: [
//             {
//               id: option1.id,
//             },
//           ],
//         },
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     console.log(
//       "==================== SEEDING Attribute SUCCESS =================== : ",
//       attribute1,
//       attribute2
//     );

//     const size1 = await prisma.size.create({
//       data: {
//         name: "Small",
//         price: 10,
//         is_active: true,
//         out_of_stock: false,
//         created_at: new Date(),
//         updated_at: new Date(),
//         arrtributes: {
//           connect: [
//             {
//               id: attribute1.id,
//             },
//             {
//               id: attribute2.id,
//             },
//           ],
//         },
//       },
//     });

//     const size2 = await prisma.size.create({
//       data: {
//         name: "Medium",
//         price: 10,
//         is_active: true,
//         out_of_stock: false,
//         created_at: new Date(),
//         updated_at: new Date(),
//         arrtributes: {
//           connect: [
//             {
//               id: attribute1.id,
//             },
//           ],
//         },
//       },
//     });

//     console.log(
//       "==================== SEEDING Size SUCCESS =================== : ",
//       size1,
//       size2
//     );

//     const category = await prisma.category.create({
//       data: {
//         name: "Category 1",
//         slug: "category-1",
//         description: "Category 1 description",
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     console.log(
//       "==================== SEEDING Category SUCCESS =================== : ",
//       category
//     );

//     const product = await prisma.product.create({
//       data: {
//         category: {
//           connect: {
//             id: category.id,
//           },
//         },
//         name: "Product 1",
//         slug: "product-1",
//         description: "Product 1 description",
//         polpularity: 10,
//         tags: "tag1,tag2",
//         price: 10,
//         is_active: true,
//         sizes: {
//           connect: [
//             {
//               id: size1.id,
//             },
//             {
//               id: size2.id,
//             },
//           ],
//         },
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     });

//     console.log(
//       "==================== SEEDING Product SUCCESS =================== : ",
//       product
//     );
//   } catch (error) {
//     console.log(
//       "==================== SEEDING ERROR =================== : ",
//       error
//     );
//   }
// };

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

adminSeed();
