import { Request } from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const IMAGE_URL = process.env.IMAGE_URL || "localhost:9000";

export const isJSONParseable = (str: string) => {
  try {
    if (
      str.includes("{") ||
      (str.includes("[") && str.length > 0 && JSON.parse(str))
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const retriveImagesUrl = (item: any, req: Request) => {
  return item.images.map((image: any) => {
    return {
      ...image,
      url: `${req.get("X-Forwarded-Proto") || "http"}://${IMAGE_URL}${
        image.url
      }`,
    };
  });
};

export const retriveImageUrl = (item: any, req: Request) => {
  return {
    ...item,
    image: {
      ...item.image,
      url: `${req.get("X-Forwarded-Proto") || "http"}://${IMAGE_URL}${
        item.image.url
      }`,
    },
  };
};

export const saveImages = async (
  files: formidable.File[] | string[],
  type: string
) => {
  try {
    let filePaths: {
      url: string;
    }[] = [];
    for (const file of files) {
      if (typeof file === "string") {
        filePaths.push({
          url: file
            .replace(IMAGE_URL, "")
            .replace("http://", "")
            .replace("https://", ""),
        });
        continue;
      }
      const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
      const filePath = path.join(
        __dirname,
        "../../public/images/" + type,
        fileName
      );

      fs.copyFile(file.filepath, filePath, (err) => {
        if (err) {
          console.error("Error copying file: ", err);
        }
        console.log("File saved successfully!");
      });
      // Optionally, delete the temp file after copying (if needed)
      fs.unlink(file.filepath, (err) => {
        if (err) {
          console.error("Error deleting temp file: ", err);
        }
      });
      filePaths.push({
        url: `/images/${type}/${fileName}`,
      });
    }
    return filePaths;
  } catch (error) {
    console.log(
      "==================== ERROR IN SAVING IMAGES =================== : ",
      error
    );
    return false;
  }
};

export const saveImage = async (
  file: formidable.File | string,
  type: string
) => {
  try {
    if (typeof file === "string") {
      return {
        url: file
          .replace(IMAGE_URL, "")
          .replace("http://", "")
          .replace("https://", ""),
      };
    }
    const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(
      __dirname,
      "../../public/images/" + type,
      fileName
    );
    fs.copyFile(file.filepath, filePath, (err) => {
      if (err) {
        console.error("Error copying file: ", err);
      }
      console.log("File saved successfully!");
    });
    // Optionally, delete the temp file after copying (if needed)
    fs.unlink(file.filepath, (err) => {
      if (err) {
        console.error("Error deleting temp file: ", err);
      }
    });
    console.log(
      "==================== IMAGE SAVED =================== : ",
      `/images/${type}/${fileName}`
    );
    return {
      url: `/images/${type}/${fileName}`,
    };
  } catch (error) {
    console.log(
      "==================== ERROR IN SAVING IMAGE =================== : ",
      error
    );
    return false;
  }
};

export const saveFile = async (file: formidable.File, type: string) => {
  try {
    const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(__dirname, "../../public/files", fileName);
    fs.copyFile(file.filepath, filePath, (err) => {
      if (err) {
        console.error("Error copying file: ", err);
      }
      console.log("File saved successfully!");
    });
    // Optionally, delete the temp file after copying (if needed)
    fs.unlink(file.filepath, (err) => {
      if (err) {
        console.error("Error deleting temp file: ", err);
      }
    });
    return {
      url: `/files/${fileName}`,
    };
  } catch (error) {
    console.log(
      "==================== ERROR IN SAVING FILE =================== : ",
      error
    );
    return false;
  }
};

export const retriveFile = (item: any, req: Request) => {
  return {
    ...item,
    file: {
      url: `${req.protocol}://${IMAGE_URL}/files${item.file}`,
    },
  };
};

export function getCurrentWeeksMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const currentWeeksMonday = new Date(today);

  // Calculate the number of days to subtract to get to the current week's Monday
  const daysToSubtract = (dayOfWeek + 6) % 7;
  currentWeeksMonday.setDate(today.getDate() - daysToSubtract);

  currentWeeksMonday.setUTCHours(0, 0, 0, 0);

  return currentWeeksMonday;
}

export function getPreviousWeeksMonday() {
  const currentWeeksMonday = getCurrentWeeksMonday();
  const previousWeeksMonday = new Date(currentWeeksMonday);

  previousWeeksMonday.setDate(currentWeeksMonday.getDate() - 7);

  return previousWeeksMonday;
}
