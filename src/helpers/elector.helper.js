import nodemailer from "nodemailer";

export function generateId(
  firstLastName,
  secondLastName,
  dateOfBirth,
  firstName
) {
  let id = "";
  let randomChars = "";

  firstName = removeAccents(firstName);
  secondLastName = removeAccents(secondLastName);
  firstLastName = removeAccents(firstLastName);

  id += firstLastName.substring(0, 3);
  id += secondLastName.substring(0, 1);

  const birthDate = new Date(dateOfBirth);

  id += birthDate.getDate().toString().padStart(2, "0");
  id += birthDate.getFullYear().toString();
  id += firstName.substring(0, 2);

  for (let i = 0; i < 4; i++) {
    randomChars += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  id += randomChars;

  return id.toUpperCase();
}

export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USR_EMAIL,
    pass: process.env.PSW_EMAIL,
  },
});

transporter.verify().then(() => {
  console.log("Ready for send emails");
});


export async function sendElectorCredentialbyEmail(data) {
  //send the email
  await transporter.sendMail({
    from: `"Plataforma WEB INE" <${process.env.USR_EMAIL}>`,
    to: data.email,
    subject: "Credencial Electoral",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #354052; text-align: center;">Verificación de cuenta</h1>
        <h3 style="color: #354052; text-align: center;">Contraseña del sistema:</h3>
		<h2 style="color: #354052; text-align: center;">${data.id}</h2>
    <p style="color: #354052; text-align: center;">Para continuar verifica tu cuenta haciendo clic en el siguiente boton.</p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${data.name}" style="display: inline-block; background-color: #EE007E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">VERIFICAR CUENTA</a>
        </div>
        <p style="color: #354052; text-align: center; margin-top: 20px;">Si el botón no funciona, puedes hacer clic en <a href="${data.email}" style="color: #EE007E; text-decoration: none;">este enlace</a>.</p>
    </div>
`,
  });
}
