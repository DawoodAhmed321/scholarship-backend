import { Request } from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";

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

export const retriveImageUrl = (item: any, req: Request) => {
  return item.images.map((image: any) => {
    return {
      ...image,
      image_url: `${req.protocol}://${req.get("host")}${image.image_url}`,
    };
  });
};

export const saveImages = async (files: formidable.File[], type: string) => {
  try {
    let filePaths: {
      image_url: string;
    }[] = [];
    for (const file of files) {
      const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
      const filePath = path.join(__dirname, "../../public/images", fileName);
      fs.renameSync(file.filepath, filePath);
      filePaths.push({
        image_url: `/images/${fileName}`,
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
