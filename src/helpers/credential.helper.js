import { toString } from 'qrcode';
import { JSDOM } from 'jsdom';
import nodeHtmlToImage from 'node-html-to-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function htmlToImage(htmlContent, outputFilePath) {
    try {
      const dom = new JSDOM(htmlContent);
      const outputFolder = path.dirname(outputFilePath);
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }
      await nodeHtmlToImage({
        html: htmlContent,
        output: outputFilePath,
      });
  
      return outputFilePath; // Retorna el path completo de la imagen generada
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
    }
  }


export const generateCredentialImage = async (data) => {
    try {
        let id = `{"elector_id": "${data.id}"}`;
        const codeqr = await generateQR(id);
        const htmlContent = getHTMLcontent(codeqr, data);

        // Generar un nombre de archivo con números enteros del 100 al 999
        const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        const outputFilePath = `src/assets/credentials/${data.id}.png`;

        return await htmlToImage(htmlContent, outputFilePath);

    } catch (err) {
        throw new Error(err.message);
    }
};



export const generateQR = async (id, imageSize = 30) => {
    try {
        return new Promise((resolve, reject) => {
            toString(
                id,
                { type: 'svg' },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const viewBoxSize = `4 4 ${imageSize} ${imageSize}`;
                        data = data.replace(/(viewBox=")([^"]*)(")/, `$1${viewBoxSize}$3`);
                        const dataURI = `data:image/svg+xml,${encodeURIComponent(data)}`;
                        const imgTag = `<img src="${dataURI}" alt="CodigoQR" style="width: 100%; height: 150px;" />`;

                        resolve(imgTag);
                    }
                }
            );
        });
    } catch (err) {
        throw new Error(err.message);
    }
};

function getBase64Image(imagePath) {
    const imageData = fs.readFileSync(imagePath);
    return imageData.toString('base64');
}

function getHTMLcontent(codeqr, data) {


    const currentFileUrl = import.meta.url;
    const currentDir = path.dirname(fileURLToPath(currentFileUrl));

    const logoIneBase64 = getBase64Image(path.join(currentDir, '../assets/images/logoIne.png'));
    const fotoPersonaBase64 = getBase64Image(data.picture);
    const aguilaBase64 = getBase64Image(path.join(currentDir, '../assets/images/aguilamexicana.png'));
    const mexicoSiluetaBase64 = getBase64Image(path.join(currentDir, '../assets/images/mexicoSilueta.png'));


    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                font-family: Arial, Helvetica, sans-serif;
            }
            body{
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #D4118E;
            }

            .contenedor{
                width: 500px;
                height: 500px;
                margin-top: 1rem;
                margin-bottom: 1rem;
                border-radius: 20px;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem 1rem 1rem 2rem;
            }

            .left, .right{
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: flex-start;
            }

            .left{
                height: 100%;
                width: 40%;
                gap: 20px;
            }
            .right{
                padding-left: 1.5rem;
                width: 60%;
                height: 100%;
                background-image: url("data:image/png;base64,${mexicoSiluetaBase64}");
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .picPerson{
                width:100%;
                max-height: 180px; 
                height: 180px; 
                background-image: url('data:image/png;base64,${fotoPersonaBase64}'); 
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                border-radius: 5px;
            }
            .title{
                font-weight: bold;
            }

            span>p{
                font-size: 1.2rem;
            }

            img{
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div class="contenedor">
            <div class="left">
                <img src='data:image/png;base64,${logoIneBase64}' alt="logoIne" style="height: 80px;">
                <div class="picPerson"></div>
                ${codeqr}
            </div>

            <div class="right">
                <span>
                    <h1>${data.fullName}</h1>
                    <p>${data.date_of_birth}</p>
                </span>

                <span>
                    <p class="title">Dirección:</p>
                    <p>${data.fullDirection}</p>
                </span>

                <span>
                    <p class="title">Clave de elector:</p>
                    <p>${data.id}</p>
                </span>

                <span style="display: flex; width: 100%; justify-content: space-between; padding-right: 1.5rem;">
                    <span>
                        <p class="title">Sexo:</p>
                    <p>${data.gender}</p>
                    </span>
                    <img src='data:image/png;base64,${aguilaBase64}' alt="aguila" style="height: 50px; width:50px">
                </span>
            </div>
        </div>

        
    </body>
    </html>
`;
}