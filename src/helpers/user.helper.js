import nodemailer from 'nodemailer';


export function GenerateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 12; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}
  

export function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomId = '';
    for (let i = 0; i < 8; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USR_EMAIL,
      pass: process.env.PSW_EMAIL
    }
  });
  
    transporter.verify().then(() => {
      console.log("Ready for send emails");
    })
    


export async function sendUserEmail(link, email, pass){

  //send the email
  await transporter.sendMail({
    from: `"Plataforma WEB INE" <${process.env.USR_EMAIL}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #354052; text-align: center;">Verificación de cuenta</h1>
        <h3 style="color: #354052; text-align: center;">Contraseña del sistema:</h3>
		<h2 style="color: #354052; text-align: center;">${pass}</h2>
    <p style="color: #354052; text-align: center;">Para continuar verifica tu cuenta haciendo clic en el siguiente boton.</p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${link}" style="display: inline-block; background-color: #EE007E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">VERIFICAR CUENTA</a>
        </div>
        <p style="color: #354052; text-align: center; margin-top: 20px;">Si el botón no funciona, puedes hacer clic en <a href="${link}" style="color: #EE007E; text-decoration: none;">este enlace</a>.</p>
    </div>
`
  });
}

export async function VerifiedsendUserEmail(email){


  //send the email
  await transporter.sendMail({
    from: `"Plataforma WEB INE" <${process.env.USR_EMAIL}>`,
    to: email,
    subject: "Verificacion exitosa",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #354052; text-align: center;">Tu cuenta ha sido verificada con exito!</h1>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.LINK_FRONT}" style="display: inline-block; background-color: #EE007E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">VER PLATAFORMA</a>
        </div>
        <p style="color: #354052; text-align: center; margin-top: 20px;">Si el botón no funciona, puedes hacer clic en <a href="${process.env.LINK_FRONT + "/admin"}" style="color: #EE007E; text-decoration: none;">este enlace</a>.</p>
    </div>
`
  });


}