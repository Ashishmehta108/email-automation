export interface CertificateTemplateDto {
  id: number;
  name: string;
  description: string | null;
  config: Record<string, unknown> | null;
  width: string;
  height: string;
  backgroundColor: string | null;
  backgroundImageUrl: string | null;
  showBorder: boolean;
  borderColor: string | null;
  borderWidth: string | null;
  showInnerBorder: boolean;
  innerBorderColor: string | null;
  innerBorderWidth: string | null;
  titleText: string | null;
  titleFont: string | null;
  titleSize: string | null;
  titleColor: string | null;
  titleY: string | null;
  nameFont: string | null;
  nameSize: string | null;
  nameColor: string | null;
  nameY: string | null;
  descriptionText: string | null;
  descriptionFont: string | null;
  descriptionSize: string | null;
  descriptionColor: string | null;
  descriptionY: string | null;
  eventFont: string | null;
  eventSize: string | null;
  eventColor: string | null;
  eventY: string | null;
  dateText: string | null;
  dateFont: string | null;
  dateSize: string | null;
  dateColor: string | null;
  dateY: string | null;
  issuedByFont: string | null;
  issuedBySize: string | null;
  issuedByColor: string | null;
  issuedByY: string | null;
  footerText: string | null;
  footerFont: string | null;
  footerSize: string | null;
  footerColor: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilter {
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: string;
  showInnerBorder?: boolean;
  innerBorderColor?: string;
  innerBorderWidth?: string;
  titleText?: string;
  titleFont?: string;
  titleSize?: string;
  titleColor?: string;
  titleY?: string;
  nameFont?: string;
  nameSize?: string;
  nameColor?: string;
  nameY?: string;
  descriptionText?: string;
  descriptionFont?: string;
  descriptionSize?: string;
  descriptionColor?: string;
  descriptionY?: string;
  eventFont?: string;
  eventSize?: string;
  eventColor?: string;
  eventY?: string;
  dateText?: string;
  dateFont?: string;
  dateSize?: string;
  dateColor?: string;
  dateY?: string;
  issuedByFont?: string;
  issuedBySize?: string;
  issuedByColor?: string;
  issuedByY?: string;
  footerText?: string;
  footerFont?: string;
  footerSize?: string;
  footerColor?: string;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  isActive?: boolean;
}

export interface PreviewTemplateInput {
  eventName: string;
  issuedBy: string;
  issueDate: string;
}
