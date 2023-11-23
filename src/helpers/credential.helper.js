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

    const backBase64 = getBase64Image(path.join(currentDir, '../assets/images/back.jpg'));
    const fotoPersonaBase64 = getBase64Image(data.picture);
    // const aguilaBase64 = getBase64Image(path.join(currentDir, '../assets/images/aguilamexicana.png'));
    // const mexicoSiluetaBase64 = getBase64Image(path.join(currentDir, '../assets/images/mexicoSilueta.png'));

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
                    width: 700px;
                }

                .container{
                    width: 700px;
                    height: 500px;
                    max-width: 700px;
                    max-height: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #d8d8d8;
                    background-image: url("data:image/png;base64,${backBase64}");
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                    padding-top: 43px;
                }

                .contenedor{
                    width: 591px;
                    height: 371px;
                    padding-top: 43px;
                    padding-left: 45px;
                    padding-right: 43px;
                    padding-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: column;
                }
                .Name{
                    width: 100%;
                    font-size: 1.3rem;
                    font-weight: bold;
                    padding-left: 1rem;
                    padding-bottom: .6rem;
                }

                .picPhoto{
                    min-width: 153px;
                    height: 153px;
                    border-radius: 5px;
                    background-image: url("data:image/png;base64,${fotoPersonaBase64}");
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                }
                .arriba{
                    width: 100%;
                    height: 199px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;

                }
                
                .abajo{
                    width: 100%;
                    height: 175px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .data{
                    width: 33%;
                    height: 100%;
                    padding-top: .4rem;
                }

                .data>span{
                    display: flex;
                    flex-direction: column;
                    margin-top: .8rem;
                }

                label{
                    font-weight: bold;
                    font-size: 1.2rem;
                }

                .text{
                    font-size: .9rem;
                }
                .imgqr{
                    width: 125px;
                    height: 125px;
                    max-width: 125px;
                    max-height: 125px;
                    transform: translate(30px,-1rem);
                }

            </style>
        </head>
        <body>
        <div class="container">
            <div class="contenedor">
                <div class="arriba">
                    <div class="picPhoto"></div>
                    <p class="Name">${data.fullName}</p>
                </div>
                <div class="abajo">
                    <div class="data" style="width: 50%;">
                        <span>
                            <label>Clave de elector:</label>
                            <p class="text">${data.id}</p>
                        </span>
                        <span>
                            <label>Dirección:</label>
                            <p class="text">${data.fullDirection}</p>
                        </span>

                    </div>
                    <div class="data" style="width: 30%; padding-left: 1rem;">
                        <span>
                            <label>Nacimiento:</label>
                            <p class="text">${data.date_of_birth}</p>
                        </span>
                        <span>
                            <label>Genero:</label>
                            <p class="text">${data.gender}</p>
                        </span>

                    </div>
                    <div class="data" style="width: 30%;">
                    ${codeqr}

                    </div>

                </div>



            </div>
        </div>
                
            
        </body>
        </html>
    `;

}