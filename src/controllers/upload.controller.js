import { uploaad } from "../helpers/upload.helper.js";


export const upload = uploaad.single('file');


export const uploadFile = (req, res) => {
    res.send({
      data: "archivo cargado"
    });
}

  
  