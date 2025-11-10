import { Request } from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { title } from "process";
import { createObjectCsvWriter } from "csv-writer";

const IMAGE_URL = process.env.IMAGE_URL || "http://localhost:9000";

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

/******  26f4b788-ce78-42a2-bceb-a55740671037  *******/ export const isJSONParseable =
  (str: string) => {
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
      url: `${IMAGE_URL}${image.url}`,
    };
  });
};

export const retriveImageUrl = (item: any, req: Request) => {
  return {
    ...item,
    image: {
      ...item.image,
      url: `${IMAGE_URL}${item.image.url}`,
    },
  };
};

export const saveCSV = async (
  data: {
    id: string | number;
    name: string;
    email: string;
    message: string;
    subject: string;
    type: "INQUIRY" | "JOIN_TEAM";
    created_at: string | Date;
    file: string;
  }[],
  type: "INQUIRY" | "JOIN_TEAM"
) => {
  try {
    
    const filePath = path.join(
      __dirname,
      `../../public/csv/${type}-${Date.now()}.csv`
    );
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header:
        type == "INQUIRY"
          ? [
              {
                id: "id",
                title: "ID",
              },
              {
                id: "name",
                title: "Name",
              },
              {
                id: "email",
                title: "Email",
              },
              {
                id: "subject",
                title: "Subject",
              },
              {
                id: "message",
                title: "Message",
              },
            ]
          : [
              {
                id: "id",
                title: "ID",
              },
              {
                id: "name",
                title: "Name",
              },
              {
                id: "email",
                title: "Email",
              },
              {
                id: "subject",
                title: "Subject",
              },
              { id: "file", title: "File Link" },
              {
                id: "message",
                title: "Message",
              },
            ],
    });

    const records = data.map((item) => {
      if (type === "INQUIRY") {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          message: item.message,
          subject: item.subject,
          type: item.type,
          created_at: item.created_at,
        };
      }
      return {
        ...item,
        file: `${IMAGE_URL}${item.file}`,
      };
    });

    await csvWriter.writeRecords(records);
    return filePath;
  } catch (error) {
    console.log("error while saving csv", error);
    return false;
  }
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
      const folderPath = path.join(__dirname, "../../public/images", type);
      ensureDirExists(folderPath);
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
    const folderPath = path.join(__dirname, "../../public/images", type);
    ensureDirExists(folderPath);
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
    const folderPath = path.join(__dirname, "../../public/images", type);
    ensureDirExists(folderPath);
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


const ensureDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const retriveFile = (item: any, req: Request) => {
  return {
    ...item,
    file: {
      url: `${IMAGE_URL}${item.file}`,
    },
  };
};
