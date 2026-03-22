import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { certificateTemplateRepository } from '../repository/certificate-template.repository.js';
import { studentRepository } from '../repository/student.repository.js';
import { certificateRepository } from '../repository/certificate.repository.js';
import type { CertificateTemplate, Student } from '../types/index.js';
import type { CertificateConfig, GenerateCertificateResult, CreateCertificateInput } from '../types/index.js';

type DocType = InstanceType<typeof PDFDocument>;

export class CertificateService {
  private outputDir: string;
  private defaultTemplate: any;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'output');
    this.ensureOutputDir();
    this.defaultTemplate = this.getDefaultTemplate();
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Get default template configuration
   */
  private getDefaultTemplate() {
    return {
      width: 841.89,
      height: 595.28,
      backgroundColor: '#FFFFFF',
      showBorder: true,
      borderColor: '#1B2B4B',
      borderWidth: 3,
      showInnerBorder: true,
      innerBorderColor: '#C9A84C',
      innerBorderWidth: 1,
      titleText: 'Certificate of Completion',
      titleFont: 'Helvetica-Bold',
      titleSize: 36,
      titleColor: '#1B2B4B',
      titleY: 150,
      nameFont: 'Helvetica-Bold',
      nameSize: 28,
      nameColor: '#1B2B4B',
      nameY: 240,
      descriptionText: 'This is to certify that',
      descriptionFont: 'Helvetica',
      descriptionSize: 14,
      descriptionColor: '#1B2B4B',
      descriptionY: 310,
      eventFont: 'Helvetica-Bold',
      eventSize: 20,
      eventColor: '#C9A84C',
      eventY: 340,
      dateText: 'Date:',
      dateFont: 'Helvetica-Oblique',
      dateSize: 14,
      dateColor: '#1B2B4B',
      dateY: 380,
      issuedByFont: 'Helvetica',
      issuedBySize: 12,
      issuedByColor: '#1B2B4B',
      issuedByY: 420,
      footerText: 'Roll No:',
      footerFont: 'Helvetica',
      footerSize: 10,
      footerColor: '#C9A84C',
    };
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  /**
   * Draw border on certificate
   */
  private drawBorder(doc: DocType, template: any, width: number, height: number) {
    if (template.showBorder) {
      const borderWidth = parseFloat(template.borderWidth) || 3;
      doc.lineWidth(borderWidth);
      doc.strokeColor(template.borderColor || '#1B2B4B');
      doc.rect(15, 15, width - 30, height - 30).stroke();
    }

    if (template.showInnerBorder) {
      const innerBorderWidth = parseFloat(template.innerBorderWidth) || 1;
      doc.lineWidth(innerBorderWidth);
      doc.strokeColor(template.innerBorderColor || '#C9A84C');
      doc.rect(23, 23, width - 46, height - 46).stroke();
    }
  }

  /**
   * Draw text element on certificate
   */
  private drawText(
    doc: DocType,
    text: string,
    font: string,
    size: number,
    color: string,
    y: number,
    width: number,
    align: 'left' | 'center' | 'right' = 'center'
  ) {
    doc.fontSize(size);
    doc.font(font);
    doc.fillColor(color);
    doc.text(text, 0, y, {
      align,
      width,
    });
  }

  /**
   * Generate PDF certificate using a template
   */
  private async createPDF(
    student: Student,
    config: CertificateConfig,
    template?: CertificateTemplate
  ): Promise<string> {
    const tmpl = template || (this.defaultTemplate as any);
    const width = parseFloat(tmpl.width as any) || 841.89;
    const height = parseFloat(tmpl.height as any) || 595.28;

    const outputPath = path.join(
      this.outputDir,
      `${this.sanitizeFilename(student.name)}_${student.rollNo}.pdf`
    );

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Background color
      if (tmpl.backgroundColor) {
        doc.rect(0, 0, width, height).fill(tmpl.backgroundColor);
      }

      // Draw borders
      this.drawBorder(doc, tmpl, width, height);

      // Title
      this.drawText(
        doc,
        tmpl.titleText || 'Certificate of Completion',
        tmpl.titleFont || 'Helvetica-Bold',
        parseFloat(tmpl.titleSize as any) || 36,
        tmpl.titleColor || '#1B2B4B',
        parseFloat(tmpl.titleY as any) || 150,
        width
      );

      // Student name
      this.drawText(
        doc,
        student.name,
        tmpl.nameFont || 'Helvetica-Bold',
        parseFloat(tmpl.nameSize as any) || 28,
        tmpl.nameColor || '#1B2B4B',
        parseFloat(tmpl.nameY as any) || 240,
        width
      );

      // Description text
      this.drawText(
        doc,
        `${tmpl.descriptionText || 'This is to certify that'} ${student.name} has successfully completed`,
        tmpl.descriptionFont || 'Helvetica',
        parseFloat(tmpl.descriptionSize as any) || 14,
        tmpl.descriptionColor || '#1B2B4B',
        parseFloat(tmpl.descriptionY as any) || 310,
        width
      );

      // Event name
      this.drawText(
        doc,
        config.eventName,
        tmpl.eventFont || 'Helvetica-Bold',
        parseFloat(tmpl.eventSize as any) || 20,
        tmpl.eventColor || '#C9A84C',
        parseFloat(tmpl.eventY as any) || 340,
        width
      );

      // Date
      this.drawText(
        doc,
        `${tmpl.dateText || 'Date:'} ${config.date}`,
        tmpl.dateFont || 'Helvetica-Oblique',
        parseFloat(tmpl.dateSize as any) || 14,
        tmpl.dateColor || '#1B2B4B',
        parseFloat(tmpl.dateY as any) || 380,
        width
      );

      // Issued by
      this.drawText(
        doc,
        config.issuedBy,
        tmpl.issuedByFont || 'Helvetica',
        parseFloat(tmpl.issuedBySize as any) || 12,
        tmpl.issuedByColor || '#1B2B4B',
        parseFloat(tmpl.issuedByY as any) || 420,
        width
      );

      // Footer with roll number
      this.drawText(
        doc,
        `${tmpl.footerText || 'Roll No:'} ${student.rollNo}`,
        tmpl.footerFont || 'Helvetica',
        parseFloat(tmpl.footerSize as any) || 10,
        tmpl.footerColor || '#C9A84C',
        height - 40,
        width
      );

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Generate certificate for a student using default template
   */
  async generateCertificate(
    studentId: number,
    config: CertificateConfig
  ): Promise<GenerateCertificateResult> {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    const certInput: CreateCertificateInput = {
      studentId,
      eventName: config.eventName,
      issuedBy: config.issuedBy,
      issueDate: config.date,
    };
    const certificate = await certificateRepository.create(certInput);

    const pdfPath = await this.createPDF(student, config);

    await certificateRepository.setPdfPath(certificate.id, pdfPath);

    return {
      certificateId: certificate.id,
      pdfPath,
      student,
    };
  }

  /**
   * Generate certificate for a student using a specific template
   */
  async generateCertificateWithTemplate(
    studentId: number,
    config: CertificateConfig,
    templateId: number
  ): Promise<GenerateCertificateResult> {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    const template = await certificateTemplateRepository.findById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const certInput: CreateCertificateInput = {
      studentId,
      templateId: templateId,
      eventName: config.eventName,
      issuedBy: config.issuedBy,
      issueDate: config.date,
    };
    const certificate = await certificateRepository.create(certInput);

    const pdfPath = await this.createPDF(student, config, template);

    await certificateRepository.setPdfPath(certificate.id, pdfPath);

    return {
      certificateId: certificate.id,
      pdfPath,
      student,
      templateId,
    };
  }

  /**
   * Generate certificates for multiple students
   */
  async generateBulkCertificates(
    studentIds: number[],
    config: CertificateConfig,
    templateId?: number
  ): Promise<GenerateCertificateResult[]> {
    const results: GenerateCertificateResult[] = [];

    for (const studentId of studentIds) {
      try {
        let result: GenerateCertificateResult;
        if (templateId) {
          result = await this.generateCertificateWithTemplate(studentId, config, templateId);
        } else {
          result = await this.generateCertificate(studentId, config);
        }
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate certificate for student ${studentId}:`, error);
      }
    }

    return results;
  }

  /**
   * Preview a template by generating a sample PDF
   */
  async previewTemplate(
    templateId: number,
    config: CertificateConfig
  ): Promise<string> {
    const template = await certificateTemplateRepository.findById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const sampleStudent: Student = {
      id: 0,
      name: 'Sample Student',
      rollNo: 'SAMPLE001',
      email: 'sample@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.createPDF(sampleStudent, config, template);
  }
}

export const certificateService = new CertificateService();
