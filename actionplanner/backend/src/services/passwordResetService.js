import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class PasswordResetService {
  
  static async requestPasswordReset(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { cliente: true }
    });

    if (!user) {
      return { message: "Se o email existir, um link de recuperação será enviado." };
    }

    if (user.status === "INATIVO") {
      throw new Error("Usuário inativo");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await prisma.passwordReset.updateMany({
      where: {
        userId: user.id,
        used: false
      },
      data: { used: true }
    });

    // Cria novo token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await this.sendResetEmail(user.email, user.nome, resetUrl);

    return { message: "Se o email existir, um link de recuperação será enviado." };
  }

  static async sendResetEmail(email, nome, resetUrl) {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "ActionPlanner"
      },
      subject: "Recuperação de Senha - ActionPlanner",
      html: this.getEmailTemplate(nome, resetUrl)
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error("Erro ao enviar email:", error.response?.body || error);
      throw new Error("Erro ao enviar email de recuperação");
    }
  }

  static getEmailTemplate(nome, resetUrl) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header com logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #C51736 0%, #9E1229 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ActionPlanner
              </h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 14px;">
                Gestão Inteligente de Tarefas
              </p>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                Olá, ${nome}!
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>ActionPlanner</strong>.
              </p>

              <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Clique no botão abaixo para criar uma nova senha:
              </p>

              <!-- Botão de ação -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #C51736 0%, #9E1229 100%); text-align: center;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 32px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>⏱️ Atenção:</strong> Este link expira em <strong>1 hora</strong>.
                </p>
              </div>

              <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Se você não solicitou esta recuperação, ignore este email. Sua senha permanecerá inalterada.
              </p>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                  Caso o botão não funcione, copie e cole o link abaixo no navegador:
                </p>
                <p style="margin: 0; color: #C51736; font-size: 13px; word-break: break-all;">
                  <a href="${resetUrl}" style="color: #C51736; text-decoration: underline;">${resetUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                <strong>ActionPlanner</strong> - Gestão Inteligente de Tarefas
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} ActionPlanner. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  static async validateResetToken(token) {
    const reset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!reset) {
      throw new Error("Token inválido");
    }

    if (reset.used) {
      throw new Error("Token já utilizado");
    }

    if (new Date() > reset.expiresAt) {
      throw new Error("Token expirado");
    }

    return reset;
  }

  static async resetPassword(token, newPassword) {
    const reset = await this.validateResetToken(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true }
      })
    ]);

    return { message: "Senha redefinida com sucesso" };
  }
}