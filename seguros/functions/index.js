/**
 * Importa as bibliotecas necessárias.
 * 'firebase-functions' para criar a Cloud Function.
 * 'nodemailer' para enviar os e-mails.
 */
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

/**
 * CONFIGURAÇÃO SEGURA DAS CREDENCIAIS DE E-MAIL
 * Aqui, estamos pegando o usuário e a senha que vamos configurar no Firebase,
 * em vez de escrevê-los diretamente no código. É mais seguro!
 */
const gmailUser = functions.config().gmail.user;
const gmailPass = functions.config().gmail.pass;

/**
 * CONFIGURAÇÃO DO NODEMAILER
 * O 'transporter' é o objeto responsável por enviar o e-mail.
 * Usamos o serviço do Gmail como exemplo.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

/**
 * NOSSA CLOUD FUNCTION PRINCIPAL
 * O nome da nossa função será 'enviarEmailNovoLead'.
 */
exports.enviarEmailNovoLead = functions.database
    .ref("/leads-seguros/{leadId}")
    .onCreate((snapshot, context) => {
    // 1. Pega os dados do novo lead que foi criado.
      const lead = snapshot.val();
      const leadId = context.params.leadId;

      console.log(`Novo lead recebido (${leadId}):`, lead);

      // 2. Monta o e-mail que será enviado.
    const mailOptions = {
      from: `"Eterna Capital Leads" <${gmailUser}>`,
      to: "raulbispo222@gmail.com",
      subject: `Novo Lead Recebido: ${lead.nome}`,
      // Corpo do e-mail em HTML com linhas quebradas para respeitar o limite.
      html: `
        <p><strong>
          Um novo lead foi recebido através do formulário de Seguros.
        </strong></p>
        <hr>
        <h3>Detalhes do Lead:</h3>
        <ul>
          <li><strong>Nome:</strong> ${lead.nome}</li>
          <li><strong>Email:</strong> ${lead.email}</li>
          <li><strong>Telefone:</strong> ${lead.telefone}</li>
          <li><strong>Data de Recebimento:</strong> ` +
          `${new Date(lead.dataRecebimento).toLocaleString("pt-BR")}</li>
        </ul>
      `,
    };

      // 3. Envia o e-mail usando o transporter.
      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar e-mail:", error);
          return;
        }
        console.log("E-mail de notificação enviado com sucesso:", info.response);
      });
    });
