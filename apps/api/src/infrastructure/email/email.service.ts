import nodemailer from 'nodemailer';
import { env } from '@/config/env';
import {
  verificationTemplate,
  passwordResetTemplate,
  magicLinkTemplate,
  orgInviteTemplate,
  welcomeTemplate,
  renderCompleteTemplate
} from './email.templates';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'localhost',
      port: Number(env.SMTP_PORT) || 587,
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER || '',
        pass: env.SMTP_PASS || '',
      },
    });
  }

  public async sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.SMTP_FROM || 'noreply@tasma.ai',
      to,
      subject,
      html,
      text,
    });
  }

  public async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const url = `${env.APP_URL}/auth/verify-email?token=${token}`;
    const { subject, html, text } = verificationTemplate(name, url);
    await this.sendEmail(to, subject, html, text);
  }

  public async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const url = `${env.APP_URL}/auth/reset-password?token=${token}`;
    const { subject, html, text } = passwordResetTemplate(name, url);
    await this.sendEmail(to, subject, html, text);
  }

  public async sendMagicLinkEmail(to: string, url: string): Promise<void> {
    const { subject, html, text } = magicLinkTemplate(url);
    await this.sendEmail(to, subject, html, text);
  }

  public async sendOrgInviteEmail(to: string, orgName: string, inviterName: string, role: string, token: string): Promise<void> {
    const url = `${env.APP_URL}/invitations/accept?token=${token}`;
    const { subject, html, text } = orgInviteTemplate(inviterName, orgName, role, url);
    await this.sendEmail(to, subject, html, text);
  }

  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const { subject, html, text } = welcomeTemplate(name);
    await this.sendEmail(to, subject, html, text);
  }

  public async sendRenderCompleteEmail(to: string, projectName: string, downloadUrl: string): Promise<void> {
    const { subject, html, text } = renderCompleteTemplate(projectName, downloadUrl);
    await this.sendEmail(to, subject, html, text);
  }
}

export const emailService = new EmailService();
